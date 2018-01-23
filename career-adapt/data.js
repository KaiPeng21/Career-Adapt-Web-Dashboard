// JavaScript source code

var survey = [
    {
        "Type": "Concern",
        "Question": "�ڷ|��Ҧۤv������"
    },
    {
        "Type": "Concern",
        "Question": "�ڪ��D���骺��ܱN�|�y�N�ڪ�����"
    },
    {
        "Type": "Concern",
        "Question": "�ڷ|�����Ӷi��ǳ�"
    },
    {
        "Type": "Concern",
        "Question": "�ڲM���ۤv�����n��ܪ��Ш|�M¾�~����"
    },
    {
        "Type": "Concern",
        "Question": "�ڷ|��p�󧹦��ؼжi��W��"
    },
    {
        "Type": "Concern",
        "Question": "�ڷ|���ߦۤv�����ӥͲP"
    },
    {
        "Type": "Control",
        "Question": "�گ�O�����["
    },
    {
        "Type": "Control",
        "Question": "�گ�ۤv���M�w"
    },
    {
        "Type": "Control",
        "Question": "�گର�ۤv����ʭt�d"
    },
    {
        "Type": "Control",
        "Question": "�گ���@�ۤv���H��"
    },
    {
        "Type": "Control",
        "Question": "�گ�̾a�ۤv"
    },
    {
        "Type": "Control",
        "Question": "�ڷ|���@�ǹ�ۤv�O�n���Ʊ�"
    },
    {
        "Type": "Curiosity",
        "Question": "�ڷ|�����g�D������"
    },
    {
        "Type": "Curiosity",
        "Question": "�ڷ|�M�D�ۧڦ��������|"
    },
    {
        "Type": "Curiosity",
        "Question": "�b���M�w���e�A�ڷ|���N���P���ﶵ"
    },
    {
        "Type": "Curiosity",
        "Question": "�ڷ|�[��P�����Ƥ�k"
    },
    {
        "Type": "Curiosity",
        "Question": "���ڦ����ðݡA�ڷ|�`�J���s"
    },
    {
        "Type": "Curiosity",
        "Question": "���s�����|�A�ڷ|����n�_���A��"
    },
    {
        "Type": "Confidence",
        "Question": "�گ঳�į�a��������"
    },
    {
        "Type": "Confidence",
        "Question": "�ڷ|�p���l�l��Ʊ����n"
    },
    {
        "Type": "Confidence",
        "Question": "�ڷ|�ǲ߷s���ޯ�"
    },
    {
        "Type": "Confidence",
        "Question": "�گ�E�o�ۤv����O"
    },
    {
        "Type": "Confidence",
        "Question": "�ڷ|�Q��k�J�A��ê"
    },
    {
        "Type": "Confidence",
        "Question": "�ڷ|�Q��k�ѨM���D"
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
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">1 - �q���p�� </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">2 - �ܤ֦p�� </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\" checked=\"checked\">3 - ���ɦp�� </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">4 - ���q�p�� </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">5 - �g�`�p�� </label>";
        htmltext += "<label class=\"col-sm-2\"><input type=\"radio\" name=\"q" + i + "\">6 - �`�O�p�� </label>";
        htmltext += "</div>";

        /*
        htmltext += "<select class=\"form-control\" id=\"q" + i + "\">";
        htmltext += "<option>1 - �q���p��</option>";
        htmltext += "<option>2 - ���ɦp��</option>";
        htmltext += "<option selected>3 - ���q�p��</option>";
        htmltext += "<option>4 - �g�`�p��</option>";
        htmltext += "<option>5 - �`�O�p��</option>";
        htmltext += "</select>";
        */

        htmltext += "</div>";
        surveyref.insertAdjacentHTML('beforeBegin', htmltext);
    }
    
}