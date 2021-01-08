var task = "";
var solution = 0;
var has_answered = false;
var answers_texts = ['', '', '', ''];
var answer_elements = [
    document.getElementById("answer0"),
    document.getElementById("answer1"),
    document.getElementById("answer2"),
    document.getElementById("answer3")];

update_term_async();
update_jump_count();
update_tries();

$("#task_request").click(function () {
    if(!has_answered)
    {
        if(confirm("Willst du diese Aufgabe wirklich überspringen? Das wird als halbe falsche Antwort gewertet."))
        {
            $.post( "/db_api/update_tries",  {change: -0.5})
                .done(function( data ) {
                    update_tries()
                });
            update_term_async();
            for (var i = 0; i < answer_elements.length; i++) {
                answer_elements[i].style.backgroundColor = "#fcf0fc";
            }
        }
    }
    else
    {
        update_term_async();
        for (var i = 0; i < answer_elements.length; i++) {
            answer_elements[i].style.backgroundColor = "#fcf0fc";
        }
    }
});

$("#answer0").click(function () {
    validate_solution(0);
});

$("#answer1").click(function () {
    validate_solution(1);
});

$("#answer2").click(function () {
    validate_solution(2);
});

$("#answer3").click(function () {
    validate_solution(3);
});

function validate_solution(number) {
    if(!has_answered)
    {
        var change = '';
    if (solution === number) {
        change = 1;
    } else {
        change = -1;
    }
    $.post( "/db_api/update_jumps",  {change: change})
            .done(function( data ) {
                console.log("updating jumps: " + data);
                update_jump_count();
                update_tries();
            });
    has_answered = true;
    show_correct();
    }
}

function show_correct() {
    for (var i = 0; i < answer_elements.length; i++) {
        if (solution === i) {
            answer_elements[i].style.backgroundColor = "#4ba308";
        } else {
            answer_elements[i].style.backgroundColor = "#a30819";
        }
    }
}

function update_term_async() {
    $.get("/items", function (data, status) {  // jquery http get request
        console.log("acquisition of new term: " + status)
        task = data["term"]; //mby out
        solution = data["solution_index"];
        answers_texts = JSON.parse(data["answers"]);
        document.getElementById("task_field").innerHTML = task;
        update_answer_text(answers_texts);
    });
    has_answered = false;
}

function update_answer_text(answers) {
    for (var i = 0; i < answer_elements.length; i++) {

        answer_elements[i].innerHTML = answers_texts[i];
    }
    if (!(answers[0] === '')) { // only need to check one answer text since all are updated at the same time
        $(".answer").show(); // jquery show the answer buttons
    } else {
        $(".answer").hide();
    }
}

function update_jump_count() {
    $.get("/db_api/jumps", function (data, status) {  // jquery http get request
        document.getElementById("jumps_label").innerHTML = data["jumps"];
    });
}

function update_tries() {
    $.get("/db_api/tries", function (data, status) {  // jquery http get request
        document.getElementById("tries_label").innerHTML = data["tries"];
    });
}


//-------------
