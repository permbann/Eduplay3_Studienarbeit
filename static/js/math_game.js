/*
__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/02/06"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"
 */

import update_game_jumps_label from './plattformer/main_game.js';

var task = "";
var solution = 0;
var has_answered = false;
var jumps;
var tries;
var difficulty;
var answers_texts = ['', '', '', ''];
var answer_elements = [
    document.getElementById("answer0"),
    document.getElementById("answer1"),
    document.getElementById("answer2"),
    document.getElementById("answer3")];
var try_elements = document.getElementsByClassName("fails");

$(document).ready(function () {
    update_term();
    //load jumps
    $.get("/api/jumps", function (data, status) {  // jquery http get request
        jumps = parseInt(data["jumps"]);
        document.getElementById("jumps_label").innerHTML = jumps;
    });
    //load tries
    $.get("/api/tries", function (data, status) {  // jquery http get request
        tries = parseFloat(data['tries']);
        let decimal = tries % 1;
        let int_val = parseInt(tries);
        // color in the X es according to remaining tries
        for (let i = 0; i < int_val; i++) {
            try_elements[try_elements.length - 1 - i].style.color = "rgb(224,223,217)";
        }
        if (decimal) {
            try_elements[try_elements.length - 1 - int_val].style.color = "rgb(245,115,88)";
        }
    });
    //load difficulty
    $.get("/api/difficulty", function (data, status) {  // jquery http get request
        difficulty = parseFloat(data['active_difficulty']);
        document.getElementById("difficulty_label").innerHTML = difficulty;
    });

    // Prevent default scrolling with Space key
    window.addEventListener('keydown', function (e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
        }
    });
});


$("#task_request").click(function () {
    /*
        On click function to get new term.
        Asks for confirmation.
     */
    if (!has_answered) {
        if (confirm("Willst du diese Aufgabe wirklich überspringen? Das wird als halbe falsche Antwort gewertet.")) {
            $.ajax({
                type: "PATCH",
                data: {change: -0.5},
                url: "/api/update_tries",
                success: function (response) {
                    update_tries(response['tries']);
                    console.log(response);
                }
            });
            update_term();
            for (let i = 0; i < answer_elements.length; i++) {
                answer_elements[i].style.backgroundColor = "#fcf0fc";
            }
        }
    } else {
        update_term();
        for (let i = 0; i < answer_elements.length; i++) {
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
    /*
        If no answer is already selected select answer and increase players jump count if answer is correct.
        :param number: the selected answer index
     */
    if (has_answered) {
        return;
    }
    if (solution === number) {
        $.ajax({
            type: "PATCH",
            data: {change: 1},
            url: "/api/update_jumps",
            success: function (response) {
                update_jump_count(response['jumps']);
            }
        });
    } else {
        if (tries === 0) {
            $.ajax({
                type: "PATCH",
                data: {change: -1},
                url: "/api/update_jumps",
                success: function (response) {
                    update_jump_count(response['jumps']);
                }
            });
            $.ajax({
                type: "PATCH",
                data: {change: 3},
                url: "/api/update_tries",
                success: function (response) {
                    update_tries(response['tries']);
                }
            });
        } else {
            $.ajax({
                type: "PATCH",
                data: {change: -1},
                url: "/api/update_tries",
                success: function (response) {
                    update_tries(response['tries']);
                }
            });
        }
    }
    has_answered = true;
    show_correct();
}

function show_correct() {
    /*
        Highlights the correct answer button green others red.
     */
    for (let i = 0; i < answer_elements.length; i++) {
        if (solution === i) {
            answer_elements[i].style.backgroundColor = "#4ba308";
        } else {
            answer_elements[i].style.backgroundColor = "#a30819";
        }
    }
}

function update_term() {
    /*
        Make api call to get new math term and display it.
     */
    $.get("/api/get_math", {difficulty: 7}, function (data, status) {  // jquery http get request
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
    /*
        Updates all answer buttons.
        :param answers: answer options list
     */
    for (let i = 0; i < answer_elements.length; i++) {

        answer_elements[i].innerHTML = answers_texts[i];
    }
    if (!(answers[0] === '')) { // only need to check one answer text since all are updated at the same time
        $(".answer").show(); // jquery show the answer buttons
    } else {
        $(".answer").hide();
    }
}

function update_jump_count(change) {
    /*
        Updates global variables jumps and displays it on both jumps labels.
        :param change: the new amount of jumps
     */
    jumps = change;
    document.getElementById("jumps_label").innerHTML = jumps;
    update_game_jumps_label(jumps);
}

function update_tries(change) {
    /*
        Updates global variables tries and displays it with coloring in the X (tries).
        :param change: the new amount of tries
     */
    tries = change;
    let decimal = tries % 1;
    let int_val = parseInt(tries);
    for (let i = 0; i < int_val; i++) {
        try_elements[try_elements.length - 1 - i].style.color = "rgb(224,223,217)";
    }
    for (let i = 0; i < try_elements.length - int_val; i++) {
        try_elements[i].style.color = "rgb(240,16,1)";
    }
    if (decimal) {
        try_elements[try_elements.length - 1 - int_val].style.color = "rgb(245,115,88)";
    }
}