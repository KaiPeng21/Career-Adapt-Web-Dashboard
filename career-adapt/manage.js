// JavaScript source code

const interestData = ["Concern", "Confidence", "Control", "Curiosity", "total-score"];
const interestDataChinese = {
    "Concern": "生涯關注",
    "Confidence" : "生涯自信", 
    "Control": "生涯控制", 
    "Curiosity": "生涯好奇", 
    "total-score" : "總分"
}; 

const fbRef = firebase.database().ref();
const fbTrialRef = firebase.database().ref().child("Trial");

// summary table
var htmlSumTable = "";
// statistics table
var htmlStatTable = "";

// statistics hashmap: [string of interestData => StatResult Object]
var statResults = {};
var indStatResults = [];
var indStatResultsMap = {};



function onRetrieveTrialData(snap) {

    htmlSumTable = "";
    var isFirst = true;

    // setup the html tables and grab the survey data result from firebase database
    snap.forEach(function (snapchild) {
        snapchild.forEach(function (snapPeople) {
            var peopleData = snapPeople.val();
            var keys = Object.keys(peopleData);

            // detail data table head
            if (isFirst) {
                isFirst = false;
                htmlSumTable += "<thead><tr><th>Select</th><th>Graph-Display</th>";

                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].includes("selected")) {
                        var questions = snapPeople.child("selected-answers").val();
                        var length = Object.keys(questions).length;
                        for (var j = 0; j < length; j++) {
                            htmlSumTable += "<th>Q" + (j + 1) + "</th>";
                        }

                    } else {
                        htmlSumTable += "<th>" + keys[i] + "</th>";

                        // compute summary statistics for interest data
                        if (interestData.includes(keys[i])) {
                            statResults[keys[i]] = new StatResult();
                            htmlSumTable += "<th>rank " + keys[i] + "</th>";
                            htmlSumTable += "<th>pr " + keys[i] + "</th>";
                        }
                    }
                }
                

                htmlSumTable += "</tr></thead> <tbody>";
            }

            // start of rows of data, get the trial hash id
            var hashid = snapchild.key;
            htmlSumTable += "<tr id=\"" + hashid + "\">";
            htmlSumTable += "<td><input type=\"checkbox\" value=\"" + hashid + "\"></td>";
            htmlSumTable += "<td><input type=\"radio\" name=\"graphradio\" onclick=\"displayChart()\" value=\"" + hashid + "\"></td>";
            
            var indStat = new IndividualStatResult(hashid);

            // detail data table body
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = peopleData[key];

                if (keys[i].includes("selected")) {
                    var questions = snapPeople.child("selected-answers").val();
                    var qkeys = Object.keys(questions);
                    for (var j = 0; j < qkeys.length; j++) {
                        htmlSumTable += "<td>" + questions[qkeys[j]]["score"] + "</td>";

                        indStat.data["q" + questions[qkeys[j]]["question-number"]] = questions[qkeys[j]]["score"];
                    }
                } else {
                    htmlSumTable += "<td>" + value + "</td>";
                    indStat.data[key] = value;

                    // compute summary statistics for interest data
                    if (interestData.includes(key)) {
                        statResults[key].append(parseInt(value));
                        htmlSumTable += "<td id=\"rank-" + key + "-" + hashid + "\"></td>";
                        htmlSumTable += "<td id=\"pr-" + key + "-" + hashid + "\"></td>";
                    }
                }
            }

            indStatResults.push(indStat);
            
            htmlSumTable += "</tr>";
        });
    });
    
    // summary detail table
    htmlSumTable += "</tbody>";
    
    // statistic table
    htmlStatTable = "<thead><tr><th></th>";
    for (var i = 0; i < interestData.length; i++) {
        htmlStatTable += "<th>" + interestData[i] + "</th>";
    }
    htmlStatTable += "</tr></thead>";
    // mean
    htmlStatTable += "<tbody><tr><th>原始分數<br />平均 <br />Mean</th>";
    for (var i = 0; i < interestData.length; i++) {
        htmlStatTable += "<td>" + statResults[interestData[i]].getMean() + "</td>";
    }
    htmlStatTable += "</tr>";
    // std
    htmlStatTable += "<tbody><tr><th>原始分數<br />標準偏差 <br />STD</th>";
    for (var i = 0; i < interestData.length; i++) {
        htmlStatTable += "<td>" + statResults[interestData[i]].getSTD() + "</td>";
    }
    htmlStatTable += "</tr></tbody>";
    

    refreshTable();
}

function refreshTable() {
    // detail table
    var summaryTable = document.getElementById("summary-table");
    summaryTable.innerHTML = htmlSumTable;

    // sort the individual statistics 
    // compute rank and pr, then embed rank and pr statistics to html
    var trialSize = indStatResults.length;
    for (var i = 0; i < interestData.length; i++) {
        // sort based on the score of interest data
        indStatResults.sort(function (a, b) { return b.data[interestData[i]] - a.data[interestData[i]] });
        for (j = 0; j < trialSize; j++) {
            // compute rank and pr
            indStatResults[j].data["rank-" + interestData[i]] = j + 1;
            indStatResults[j].data["pr-" + interestData[i]] = Math.floor((trialSize - (j + 1)) / trialSize * 100);

            // store indStatResults to indStatResultsMap
            indStatResultsMap[indStatResults[j].hashid] = indStatResults[j];

            // embed rank and pr value to html
            var tdRank = document.getElementById("rank-" + interestData[i] + "-" + indStatResults[j].hashid);
            var tdPR = document.getElementById("pr-" + interestData[i] + "-" + indStatResults[j].hashid);
            tdRank.innerText = indStatResults[j].data["rank-" + interestData[i]];
            tdPR.innerText = indStatResults[j].data["pr-" + interestData[i]];
        }
    }
    
    // statistic table
    var statisticTable = document.getElementById("statistic-table");
    statisticTable.innerHTML = htmlStatTable;

    
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;
    
    csvFile = new Blob(["\ufeff", csv], { type: 'text/csv' });

    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function exportTableToCSV(filename) {
    var currDate = new Date();
    var appending = "-" + currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-" + currDate.getDate();

    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [];
        var cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csv.push(row.join(","));
    }
    
    downloadCSV(csv.join("\n"), filename + appending + ".csv");
}

function clearAll() {

    var r = confirm("You will not be able to recover the data! Do you really want to clear the entire survey submission?");

    if (r == true) {
        fbTrialRef.set({});
        alert("The survey submission has been cleared!");
    } 
}

function clearSelected() {

    var r = confirm("You will not be able to recover the data! Do you really want to clear the selected survey submission?");

    if (r == true) {
        var selected = document.querySelectorAll("input[type=checkbox]:checked");
        for (var i = 0; i < selected.length; i++) {
            fbTrialRef.child(selected[i].value).remove();
            console.log(selected[i].value);
        }
        alert("The survey submission has been cleared!");
    }
}

function selectAll() {
    var checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}

function deselectAll() {
    var checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}


var graph;

function displayChart() {

    var original = document.getElementById("original-score-list");
    var htmlIndividual = "";

    var selectedDataTrial = document.querySelector('input[name="graphradio"]:checked');
    var hashid = selectedDataTrial.value;
    var data = indStatResultsMap[hashid].data;
    var interestDataValues = [];
    for (var i = 0; i < interestData.length; i++) {
        interestDataValues.push(interestData[i] + " " + interestDataChinese[interestData[i]]);
        htmlIndividual += "<li>" + interestData[i] + " " + interestDataChinese[interestData[i]] + " : \t" + data[interestData[i]] + "</li>";
    }

    original.innerHTML = htmlIndividual;

    var dataPRValues = [];
    var userName = data["name"];
    if (data["name"] == "") {
        userName = "(匿名)";
    }
    
    document.getElementById("lname").innerText = "姓名: " + userName;
    document.getElementById("lschool").innerText = "學校: " + data["school-name"];
    document.getElementById("lschoolnumber").innerText = "學號: " + data["school-number"];
    document.getElementById("lmajor").innerText = "科系: " + data["major"];
    document.getElementById("lgender").innerText = "姓別: " + data["gender"];
    document.getElementById("lage").innerText = "年齡: " + data["age"];
    document.getElementById("ind-txt").classList.remove("hide");

    for (var i = 0; i < interestData.length; i++) {
        dataPRValues.push(data["pr-" + interestData[i]]);
    }

    var graphEle = document.getElementById("graph").getContext('2d');

    if (graph != null) {
        graph.destroy();
    }

    graph = new Chart(graphEle, {
        type: 'bar',
        data: {
            labels: interestDataValues,
            datasets: [{
                label: 'PR 值',
                data: dataPRValues,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                hoverBorderWidth: 2,
                hoverBorderColor: 'rgba(255, 99, 132, 1.0)',
            }]
        },
        options: {
            title: {
                display: true,
                text: userName + ' 的生涯調適量表結果',

            },
            legend: {
                position: 'right',
                display: false
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'PR 值',
                        fontSize: 20
                    }
                }],
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '生涯調適項目',
                        fontSize: 20
                    }
                }]
            },
            responsive: true,
            tooltips: {
                enabled: true
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            }
        }
    });
}
 