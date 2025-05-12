class Question{
    $question;
    $correct_answer;
    $incorrect_answers = [];
    $category;
    $difficulty;
    $type;
    $correctButton;
    
    //#region getter setter
    get correctButton() {
        return this.$correctButton;
    }
    set correctButton(value) {
        this.$correctButton = value;
    }
    get category() {
        return this.$category;
    }
    set category(value) {
        this.$category = value;
    }
    get correct_answer() {
        return this.$correct_answer;
    }
    set correct_answer(value) {
        this.$correct_answer = value;
    }
    get difficulty() {
        return this.$difficulty;
    }
    set difficulty(value) {
        this.$difficulty = value;
    }
    get incorrect_answers() {
        return this.$incorrect_answers;
    }
    set incorrect_answers(value) {
        this.$incorrect_answers = value;
    }
    get question() {
        return this.$question;
    }
    set question(value) {
        this.$question = value;
    }
    get type() {
        return this.$type;
    }
    set type(value) {
        this.$type = value;
    }
    //#endregion getter setter

    constructor(question, correct_answer, incorrect_answers, category, difficulty, type){
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
        this.category = category;
        this.difficulty = difficulty;
        this.type = type;

        this.show();
    }

    show(){
        let container = document.createElement("div");

        let questionInfo = document.createElement("sapn");
        questionInfo.innerHTML = "[" + this.category + ", " + this.difficulty + "]";
        container.appendChild(questionInfo);

        let questionLabel = document.createElement("p");
        questionLabel.innerHTML = this.question;
        container.appendChild(questionLabel);

        let answerContainer = document.createElement("div");
        answerContainer.classList = "answerContainer";
        container.appendChild(answerContainer);

        let answerButtons = [];

        let correctButton = document.createElement("button");
        correctButton.innerHTML = this.correct_answer;
        correctButton.addEventListener("click", checkAnswerButton);
        answerButtons.push(correctButton);
        this.correctButton = correctButton;

        this.incorrect_answers.forEach(answer => {
            let answerButton = document.createElement("button");
            answerButton.innerHTML = answer;
            answerButton.classList = "answerButton";
            answerButton.addEventListener("click", checkAnswerButton);
            answerButtons.push(answerButton);
        });
        answerButtons = shuffleArray(answerButtons);

        answerButtons.forEach(answerButton => answerContainer.appendChild(answerButton));

        let questionDiv = document.querySelector(".questionDiv");
        questionDiv.innerHTML = "";
        questionDiv.appendChild(container);
    }

    checkAnswer(button){
        if(button != this.correctButton){
            button.style.backgroundColor = "red";
            button.style.borderColor = "red";
            addIncorrect();
        }
        else{
            addCorrect();
        }

        this.correctButton.style.backgroundColor = "lime";
        this.correctButton.style.borderColor = "lime";

        newQuestion = true;
        setTimeout(createQuestion, 5000);
    }
}