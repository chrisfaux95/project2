const categories = [
    {type: "General Knowledge", id: 9},
    {type: "Entertainment: Books", id: 10},
    {type: "Entertainment: Film", id: 11},
    {type: "Entertainment: Music", id: 12},
    {type: "Entertainment: Musicals & Theatres", id: 13},
    {type: "Entertainment: TV", id: 14},
    {type: "Entertainment: Video Games", id: 15},
    {type: "Entertainment: Board Games", id: 16},
    {type: "Science & Nature", id: 17},
    {type: "Science: Computers", id: 18},
    {type: "Science: Mathematics", id: 19},
    {type: "Mythology", id: 20},
    {type: "Sports", id: 21},
    {type: "Geography", id: 22},
    {type: "History", id: 23},
    {type: "Politics", id: 24},
    {type: "Art", id: 25},
    {type: "Celebrities", id: 26},
    {type: "Animals", id: 27},
    {type: "Vehicles", id: 28},
    {type: "Entertainment: Comics", id: 29},
    {type: "Science: Gadgets", id: 30},
    {type: "Entertainment: Japanese Anime & Manga", id: 31},
    {type: "Entertainment: Cartoons & Animation", id: 32}
]
categories.sort((a,b) => {
    let nameA = a.type.toUpperCase();
    let nameB = b.type.toUpperCase();
    if(nameA < nameB) return -1;
    if(nameA > nameB) return 1;
    return 0;
})


categories.forEach(e => {
    let s = $("<option>").text(e.type);
    s.attr("value", e.id)
    s.appendTo($("#inputCategory"));

});
const difficulties = ["Easy", "Medium", "Hard", "Any"];
difficulties.forEach(e => {
    let d = $("<div>").addClass("form-check");
    let i = $("<input>").addClass("form-check-input").attr({
        type: "radio", name: "difficultyRadios"
    })
    let l = $("<label>").text(e).addClass("form-check-label")
    d.append(i,l);
    $("#difficulties").append(d);
});

const types = ["True/False", "Multiple Choice", "Any"];

types.forEach(e => {
    let d = $("<div>").addClass("form-check");
    let i = $("<input>").addClass("form-check-input").attr({
        type: "radio", name: "typeRadios"
    })
    let l = $("<label>").text(e).addClass("form-check-label")
    d.append(i,l);
    $("#types").append(d);
});


$(".categoryBtn").on("click", function() {
    // var value = $(this).val();
    // var difficulty = $(this).data...
    //var type = ...
    const MAXAMNT = 50;
    quizAjax(MAXAMNT, value, difficulty, type)
    });
    
    function quizAjax(amntNum, catNum, type, difficulty) {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=" + amntNum + "&category=" + catNum + "&difficulty=" + difficulty + "&type=" + qType,
            method: "GET"
        }).then(function (res) {
            if (res.response_code === 0) {
                console.log(res);
                count++;
                console.log(count);
            }
            else {
                if (amntNum > 0) {
                    amntNum--;
                    quizAjax(amntNum, i, type, difficulty);
                }
            }
        });
    }  