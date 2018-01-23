// JavaScript source code

var survey = [
    {
        "Type": "Concern",
        "Question": "我會思考自己的未來"
    },
    {
        "Type": "Concern",
        "Question": "我知道今日的選擇將會造就我的未來"
    },
    {
        "Type": "Concern",
        "Question": "我會為未來進行準備"
    },
    {
        "Type": "Concern",
        "Question": "我清楚自己必須要選擇的教育和職業項目"
    },
    {
        "Type": "Concern",
        "Question": "我會對如何完成目標進行規劃"
    },
    {
        "Type": "Concern",
        "Question": "我會關心自己的未來生涯"
    },
    {
        "Type": "Control",
        "Question": "我能保持樂觀"
    },
    {
        "Type": "Control",
        "Question": "我能自己做決定"
    },
    {
        "Type": "Control",
        "Question": "我能為自己的行動負責"
    },
    {
        "Type": "Control",
        "Question": "我能維護自己的信念"
    },
    {
        "Type": "Control",
        "Question": "我能依靠自己"
    },
    {
        "Type": "Control",
        "Question": "我會做一些對自己是好的事情"
    },
    {
        "Type": "Curiosity",
        "Question": "我會探索週遭的環境"
    },
    {
        "Type": "Curiosity",
        "Question": "我會尋求自我成長的機會"
    },
    {
        "Type": "Curiosity",
        "Question": "在做決定之前，我會探就不同的選項"
    },
    {
        "Type": "Curiosity",
        "Question": "我會觀察不同的做事方法"
    },
    {
        "Type": "Curiosity",
        "Question": "對於我有的疑問，我會深入探究"
    },
    {
        "Type": "Curiosity",
        "Question": "對於新的機會，我會抱持好奇的態度"
    },
    {
        "Type": "Confidence",
        "Question": "我能有效能地完成任務"
    },
    {
        "Type": "Confidence",
        "Question": "我會小心翼翼把事情做好"
    },
    {
        "Type": "Confidence",
        "Question": "我會學習新的技能"
    },
    {
        "Type": "Confidence",
        "Question": "我能激發自己的能力"
    },
    {
        "Type": "Confidence",
        "Question": "我會想辦法克服障礙"
    },
    {
        "Type": "Confidence",
        "Question": "我會想辦法解決問題"
    }
]



var fbSurveyRef = firebase.database().ref().child("Survey");
var surveyblock = document.getElementById("surveyblock");

var surveySize = survey.length;

$(document).ready(function () {
    preventDefault();
    loadSurveyData();
});

function preventDefault() {
    window.addEventListener("keydown", function (e) {
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
}

function loadSurveyData() {
    for (var i = 1; i < survey.length + 1; i++) {
        var type = survey[i-1]["Type"];
        var question = survey[i-1]["Question"];

        // add question to database
        fbSurveyRef.child("q" + i).set({ "Type": type, "Question": question });

        var surveyref = document.getElementById("survey");
        var htmltext = "<div class=\"form-group\">"
        htmltext += "<label for=\"q" + i + "\">" + i + ". " + question + "</label>";

        htmltext += "<div class=\"radio small-font\">";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">1 - 從未如此 </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">2 - 很少如此 </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\" checked=\"checked\">3 - 有時如此 </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">4 - 普通如此 </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">5 - 經常如此 </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">6 - 總是如此 </label>";
        htmltext += "</div>";

        /*
        htmltext += "<select class=\"form-control\" id=\"q" + i + "\">";
        htmltext += "<option>1 - 從未如此</option>";
        htmltext += "<option>2 - 有時如此</option>";
        htmltext += "<option selected>3 - 普通如此</option>";
        htmltext += "<option>4 - 經常如此</option>";
        htmltext += "<option>5 - 總是如此</option>";
        htmltext += "</select>";
        */

        htmltext += "</div>";
        surveyref.insertAdjacentHTML('beforeBegin', htmltext);
    }
    
}