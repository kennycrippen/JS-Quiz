// Helper Functions
function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}

// Function to get JSON data
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        var allQuestions = JSON.parse(this.responseText);
        // Loop throught the allQuestions object
		for(i = 0; i < allQuestions.length; i++) {
			// get the question and output to the document
			var question = allQuestions[i].question;
			var choices = allQuestions[i].choices;
			var	correctAnswer = allQuestions[i].correctAnswer;
			var questionHTML = document.createElement('p');
				questionHTML.innerHTML = question;

			document.getElementById('questions-' + i).appendChild(questionHTML);

			// get the choices and output to the document
			for(j = 0; j < choices.length; j++) {
				var div = document.createElement('div');
					div.className = 'choice';
					div.innerHTML = '<input class="radioclass" type="radio" name="radio-' + i + '" value="'+ choices[j] +'" id="'+ choices[j].replace(/\s+/g, '-').toLowerCase() +'">' + '<label for="'+ choices[j].replace(/\s+/g, '-').toLowerCase() +'">' + choices[j] + '</label>';
				
				document.getElementById('questions-' + i).appendChild(div);
			}

			// add the back button
			var backButton = document.createElement('button');
				backButton.innerHTML = 'Back';
				backButton.id = 'question-' + i + '-back';
				backButton.className = 'hide';

			document.getElementById('questions-' + i).appendChild(backButton);

			// add the next question button
			var nextButton = document.createElement('button');
				nextButton.innerHTML = 'Next';
				nextButton.id = 'question-' + i + '-next';
				nextButton.className = 'hide';

			document.getElementById('questions-' + i).appendChild(nextButton);
		}

		// running tally
		var numberCorrect = 0;
		function add1() {
		  numberCorrect += 1;
		  // console.log(numberCorrect);
		}
		// loop through the radio buttons and compare value with correctAnswer
		var radio = document.getElementsByClassName('radioclass');
		for (r = 0; r < radio.length; r++) {
		  radio[r].addEventListener('change', function() {
		  	var parentQuestion = this.parentNode.parentNode;
		    var parentQuestionPosition = parentQuestion.dataset.position;
		    var nextButtonId = document.getElementById('question-' + parentQuestionPosition + '-next');
		    var backButtonId = document.getElementById('question-' + parentQuestionPosition + '-back');
		    var messageHolder = document.createElement('div');

		    // disable radios after answer is selected
		    var allRadios = parentQuestion.querySelectorAll('.radioclass');
		    allRadios.forEach(function(a){
				a.disabled = true;
			});

		    if(this.value != allQuestions[parentQuestionPosition].correctAnswer) {
		      messageHolder.innerHTML = 'Sorry man, that\'s incorrect. ☠️';
		    } else {
		      messageHolder.innerHTML = 'Right on, that\'s correct! 🤘🏼';
		      add1();
		    }
		    // outpout the correct/incorrect message before the next button
		    insertBefore(messageHolder, nextButtonId);
		    // show the next button
		    nextButtonId.classList.remove('hide');
		    // show the back button
		    backButtonId.classList.remove('hide');
		    // on next button click, hide the next button and the current question list, show the next question
		    nextButtonId.addEventListener('click', function() {
		    	this.parentNode.classList.add('hide');
		    	if(this.parentNode.nextElementSibling) {
			    	this.parentNode.nextElementSibling.classList.remove('hide');
			    }
		    });
		    backButtonId.addEventListener('click', function() {
		    	this.parentNode.classList.add('hide');
		    	if(this.parentNode.previousElementSibling) {
			    	this.parentNode.previousElementSibling.classList.remove('hide');
			    }
			    var allRadios = this.parentNode.parentNode.parentNode.querySelectorAll('.radioclass');
			    allRadios.forEach(function(a){
					a.disabled = false;
				});
		    });
		    // add user score to results div
			var results = document.getElementById('results');
				results.innerHTML = 'Oh dang, you got ' + numberCorrect + ' out of ' + allQuestions.length + ' correct.';
		  });
		}
		var backButtonFirst = document.getElementById('question-0-back');
		// remove the back button from the first question bc we don't need dat shiiiii
	    backButtonFirst.classList.add('really-hide');
    }
};
xmlhttp.open('GET', 'questions.json', true);
xmlhttp.send();
