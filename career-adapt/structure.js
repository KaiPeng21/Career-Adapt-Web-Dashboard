// JavaScript source code

var Ques = class {
    constructor(questionNumber, questionText, questionType, selectedAns) {
        this.questionNumber = questionNumber;
        this.questionText = questionText;
        this.questionType = questionType;
        this.selectedAns = selectedAns;
    }
}

var Trial = class {
    constructor() {

        this.submitDate = null;

        // basic info
        this.schoolNameText = "";
        this.majorText = "";
        this.studentNameText = "";
        this.schoolNumberText = "";
        this.ageText = "";
        this.genderText = "";

        // survey stat
        this.answerList = [];
        this.totalScore = 0;
        this.typeScoreDict = {};
    }
}

var StatResult = class {
    constructor(type) {
        this.type = type;
        this.mean = 0;
        this.std = 0;
        this.sum = 0;
        this.count = 0;
        this.values = [];
        
        this.append = function (nextValue) {
            this.count += 1;
            this.sum += parseInt(nextValue);
            this.values.push(parseInt(nextValue));
            this.mean = this.sum / this.count;
            this.std = math.std(this.values);
        }
        this.getMean = function () {
            return Math.round(this.mean * 100) / 100;
        }
        this.getSTD = function () {
            return Math.round(this.std * 100) / 100;
        }   
    }
}

var IndividualStatResult = class {
    constructor(hashid) {
        this.hashid = hashid;
        this.data = {};
    }
}
