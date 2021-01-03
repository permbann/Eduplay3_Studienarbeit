var task = "Klicke auf den Button um eine Aufgabe zu bekommen."; //starting text
var solution = 0;
var answers = ['', '', '', ''];

update_term_async();

$("#task_request").click(function(){
	update_term_async();
});

function update_term_async(){
	document.getElementById("task_field").innerHTML = task;
	update_answer_text(answers);
	$.get("/items", function(data, status){
		task = data["term"];
		solution = data["solution"];
		answers = JSON.parse(data["answers"]);
	});
}

function update_answer_text(answers){
	document.getElementById("answer0").innerHTML = answers[0];
	document.getElementById("answer1").innerHTML = answers[1];
	document.getElementById("answer2").innerHTML = answers[2];
	document.getElementById("answer3").innerHTML = answers[3];
}