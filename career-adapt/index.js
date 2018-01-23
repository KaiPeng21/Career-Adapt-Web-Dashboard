// JavaScript source code

var submitBtn = document.getElementById("submitBtn");
var schoolName = document.getElementById("schoolName");
var majorName = document.getElementById("major");
var studentName = document.getElementById("name");
var schoolNumber = document.getElementById("schoolNumber");
var age = document.getElementById("age");

const fbTrialRef = firebase.database().ref().child("Trial");


function submitClick() {
    if (window.confirm("確定要將此表單送交嗎?")) {
        submit();
    }
}

function submit() {
    
    var trial = new Trial();
    trial.genderText = document.querySelector('input[name="genderradio"]:checked').parentNode.textContent;
    trial.schoolNameText = schoolName.value;
    trial.majorText = majorName.value;
    trial.studentNameText = studentName.value;
    trial.schoolNumberText = schoolNumber.value;
    trial.ageText = age.value;

    var isValid = false;
    var checkValidVar = parseInt(document.querySelector("input[name=\"q1\"]:checked").parentNode.textContent.charAt(0));

    for (var k = 1; k < surveySize + 1; k++) {
        var id = "q" + k;
        var question = survey[k - 1]["Question"];
        var type = survey[k - 1]["Type"];
        var score = parseInt(document.querySelector("input[name=\"q" + k + "\"]:checked").parentNode.textContent.charAt(0));

        if (!isValid && score != checkValidVar) {
            isValid = true;
        }

        trial.answerList.push(new Ques(k, question, type, score));
        trial.totalScore = trial.totalScore + score;
        if (type in trial.typeScoreDict) {
            trial.typeScoreDict[type] += score;
        } else {
            trial.typeScoreDict[type] = score;
        }
    }

    trial.submitDate = new Date();

    if (isValid) {
        addTrialToDatabase(trial);
        window.alert("您的表單已送交!");
    } else {
        window.alert("由於有被亂填的跡象，此表單將不會被送交");
    }
} 

function addTrialToDatabase(trial) {

    var top = fbTrialRef.push();

    top.child("people").set({
        "submit-year": trial.submitDate.getFullYear(),
        "submit-month": trial.submitDate.getMonth() + 1,
        "submit-date": trial.submitDate.getDate(),
        "submit-hour": trial.submitDate.getHours(),
        "submit-minute": trial.submitDate.getMinutes(),
        "submit-second": trial.submitDate.getSeconds(),
        "submit-time": trial.submitDate.getTime(),
        "school-name": trial.schoolNameText,
        "major": trial.majorText,
        "name": trial.studentNameText,
        "school-number": trial.schoolNumberText,
        "age": trial.ageText,
        "gender": trial.genderText,
        "total-score": trial.totalScore
    });

    for (var k = 0; k < surveySize; k++) {
        top.child("people/selected-answers/q" + trial.answerList[k].questionNumber).set({
            "question-number": trial.answerList[k].questionNumber,
            "question-text": trial.answerList[k].questionText,
            "question-type": trial.answerList[k].questionType,
            "score": trial.answerList[k].selectedAns
        });
    }

    for (var key in trial.typeScoreDict) {
        if (trial.typeScoreDict.hasOwnProperty(key)) {
            var keystr = key.toLowerCase() + "-score";
            top.child("people").update({
                [key]: trial.typeScoreDict[key]
            });
        }
    }
    
}
