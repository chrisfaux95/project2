$(document).ready(function () {
    var userData = "";
    $.get("/api/user_data").then(data => {
        userData = data;
        console.log("USER DATA USERNAME: ", userData.username);
        $("#userNameText").text(userData.username);
    });
    var pickedCategory;
    var index = 0;
    var resArr = [];
    var correctCount = 0;
    const questionContainer = $("#question-container");
    const categoryContainer = $("#category-container");
    questionContainer.hide();
    categoryContainer.show();
    const br = "<br>";

    const categories = [
        { name: "General Knowledge", value: 9 },
        { name: "Entertainment: Books", value: 10 },
        { name: "Entertainment: Film", value: 11 },
        { name: "Entertainment: Music", value: 12 },
        { name: "Entertainment: Musicals & Theatres", value: 13 },
        { name: "Entertainment: TV", value: 14 },
        { name: "Entertainment: Video Games", value: 15 },
        { name: "Entertainment: Board Games", value: 16 },
        { name: "Science & Nature", value: 17 },
        { name: "Science: Computers", value: 18 },
        { name: "Science: Mathematics", value: 19 },
        { name: "Mythology", value: 20 },
        { name: "Sports", value: 21 },
        { name: "Geography", value: 22 },
        { name: "History", value: 23 },
        { name: "Politics", value: 24 },
        { name: "Art", value: 25 },
        { name: "Celebrities", value: 26 },
        { name: "Animals", value: 27 },
        { name: "Vehicles", value: 28 },
        { name: "Entertainment: Comics", value: 29 },
        { name: "Science: Gadgets", value: 30 },
        { name: "Entertainment: Japanese Anime & Manga", value: 31 },
        { name: "Entertainment: Cartoons & Animation", value: 32 }
    ]
    categories.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    })


    categories.forEach(e => {
        let s = $("<option>").text(e.name);
        s.attr("value", e.value)
        s.appendTo($("#inputCategory"));

    });
    const difficulties = [
        { name: "Easy", value: "easy" },
        { name: "Medium", value: "medium" },
        { name: "Hard", value: "hard" },
        { name: "Any", value: "any" }];
    difficulties.forEach(e => {
        let d = $("<div>").addClass("form-check");
        let i = $("<input>").addClass("form-check-input").attr({
            type: "radio", name: "difficultyRadios", value: e.value
        })
        let l = $("<label>").text(e.name).addClass("form-check-label")
        d.append(i, l);
        $("#difficulties").append(d);
    });

    const types = [
        { name: "True/False", value: "boolean" },
        { name: "Multiple Choice", value: "multiple" },
        { name: "Any", value: "any" }];

    types.forEach(e => {
        let d = $("<div>").addClass("form-check");
        let i = $("<input>").addClass("form-check-input").attr({
            type: "radio", name: "typeRadios", value: e.value
        })
        let l = $("<label>").text(e.name).addClass("form-check-label")
        d.append(i, l);
        $("#types").append(d);
    });


    $(".categoryBtn").on("click", function () {
        event.preventDefault();
        const category = $("#inputCategory :selected").val()
        pickedCategory = category;
        const difficulty = $("input[type='radio'][name='difficultyRadios']:checked").val();
        const type = $("input[type='radio'][name='typeRadios']:checked").val();
        const MAXAMNT = 50;
        setHighScoretext(pickedCategory);
        resArr = [];
        correctCount = 0;
        quizAjax(MAXAMNT, category, difficulty, type, resArr);
    });

    $(document).on("click", "button.ansButton", function () {
        var answer = parseInt($(this).attr("data"));
        if (answer === 1) {
            correctCount++;
        }
        $("#userAns").html("Your answer: " + $(this).text());
        $("#correctAns").html("Correct answer: " + resArr[index].correct_answer);
        index++;
        showQuestion(resArr, index);
    })

    function quizAjax(amntNum, catNum, difficulty, type, resArr) {
        //possibly add amount number to display
        var queryURL = "https://opentdb.com/api.php?amount=" + amntNum + "&category=" + catNum;
        if (difficulty != "any") {
            queryURL += "&difficulty=" + difficulty;
        }
        if (type != "any") {
            queryURL += "&type=" + type;
        }

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (res) {
            if (res.response_code === 0) {
                resArr.push(...res.results);
                shuffleArray(resArr);
                categoryContainer.hide();
                showQuestion(resArr, index);
            }
            else {
                if (amntNum > 0) {
                    quizAjax(amntNum - 1, catNum, difficulty, type, resArr);
                }
            }
        });
    }

    /* Function to shuffle the questions:
    From: https://stackoverflow.com/a/12646864/13871979 */
    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // let clock = 60;
    // function startClock(){
    //     var gameClock = setInterval(function(){
    //         if(clock >= 0){
    //             $("#clock").text("You have " + clock + " seconds to finish the quiz");
    //             clock--;
    //             $("#localScore").text("Your score is " + correctCount);
    //         }
    //         else{
    //             $("#localScore").text("Time's up. Your score was " + correctCount);
    //         }
    //     }, 1000)
    // }

    function showQuestion(resArr, index) {
        // changed resArr.length to 10
        if (index < 10 && index < resArr.length) {

            questionContainer.empty();
            questionContainer.show();
            catH = $("<h1>").html(resArr[index].category);
            questionContainer.append(catH);
            questionContainer.append("<hr>");
            questionContainer.append("<br>");
            // startClock()
            var ansArr = [];
            var questionStr = resArr[index].question;
            var questionP = $("<h4>").html(questionStr);
            questionContainer.append(questionP);
            questionContainer.append("<br>");

            if (resArr[index].type === "multiple") {
                ansArr = [...resArr[index].incorrect_answers, resArr[index].correct_answer]
                shuffleArray(ansArr);
                ansArr.forEach(e => {
                    let ansBtn = $("<button>").html(e).addClass("btn-hover color-3 ansButton");
                    if (e === resArr[index].correct_answer) {
                        ansBtn.attr("data", 1);
                    } else {
                        ansBtn.attr("data", 0);
                    }
                    questionContainer.append(ansBtn, br);
                });
            } else if (resArr[index].type === "boolean") {
                var ansBtn1 = $("<button>").html("True");
                ansBtn1.attr("class", "btn btn-success ansButton");
                var ansBtn2 = $("<button>").html("False");
                ansBtn2.attr("class", "btn btn-danger ansButton");
                if (resArr[index].correct_answer === "True") {
                    ansBtn1.attr("data", 1);
                    ansBtn2.attr("data", 0);
                } else if (resArr[index].correct_answer === "False") {
                    ansBtn1.attr("data", 0);
                    ansBtn2.attr("data", 1);
                }
                questionContainer.append(ansBtn1, br, ansBtn2, br);
            }
            questionContainer.append("<br>");
        } else {
            let total = (resArr.length > 10 ? 10 : resArr.length);
            let finalScore = Math.floor((correctCount / total) * 1000)
            $.post("/api/score", {
                UserId: userData.id,
                score: finalScore,
                CategoryId: pickedCategory
            }).then(function () {
                console.log("score saved");
            });

            $("#score").text("Score: " + finalScore);
            questionContainer.hide();
            var finishH = $("<h1>").text("Quiz over!");
            var hr = $("<hr>");
            $("#finalContainer").append(finishH, br, hr, br);
            $("#finalContainer").show();
            $("#userAns").text("Your answer: ");
            $("#correctAns").text("Correct answer: ");
        }
    }

});

function setHighScoretext(catId) {
    $.get("/api/scores/by_category/" + catId, (data) => {
        console.log(data)
        let hsScore = (data[0] ? data[0].score : "N/A");
        let hsName = (data[0] ? data[0].User.username : "N/A");
        console.log(hsScore,hsName);
        $("#hs-user").text(hsName);
        $("#hs-score").text(hsScore);
    });
}
