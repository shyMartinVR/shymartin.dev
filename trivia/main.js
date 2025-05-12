let questionObject;
let newQuestion = true;
let answered = true;
let questionCount = 0;
let correctCount = 0;
let incorrectCount = 0;

function newQuestionButton() {
    newQuestion = true;
    createQuestion();
}

function createQuestion() {
    if(!newQuestion)
        return;
        newQuestion = false;
    document.querySelector(".questionDiv").innerText = "loading question...";
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "https://opentdb.com/api.php?amount=1&category=" + selection("questionCategory") + "&difficulty=" + selection("questionDifficulty") + "&type=" + selection("questionType"));
    oReq.send();
}

function reqListener () {
    let x = JSON.parse(this.response).results[0];
    questionObject = new Question(x.question, x.correct_answer, x.incorrect_answers, x.category, x.difficulty, x.type);

    questionCount++;
    document.querySelector(".questionCount").innerText = questionCount;
}

function checkAnswerButton() {
    if(!newQuestion)
        questionObject.checkAnswer(this);
}

function shuffleArray(unmixed){
    let mixed = [];
    
    unmixed.forEach(element => {
        do{
            rand = Math.floor(Math.random()*unmixed.length);
        }
        while(mixed[rand] != undefined);
        mixed[rand] = element;
    });
    return mixed;
}

function addCorrect() {
    correctCount++
    document.querySelector(".questionCorrect").innerText = correctCount;
}

function addIncorrect() {
    incorrectCount++
    document.querySelector(".questionIncorrect").innerText = incorrectCount;
}

function selection(from) {
    let all = document.querySelectorAll("." + from);
    let selected = [];
    all.forEach(element => {
        if(element.checked)
            selected.push(element.id);
    });
    
    if(selected.length == 0)
        return "";
    return selected[Math.floor(Math.random() * selected.length)];
}