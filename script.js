
let jsonFileContent = null;
function buttonClicked() {
	alert('Button clicked!');
}

// Resize the canvas to fill the browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
	const canvas = document.getElementById('fullscreenCanvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

resizeCanvas();


function closeDiv() {
	document.getElementById('centeredDiv').style.display = 'none';
	document.getElementById('overlay').classList.remove('visible');
}

function showDiv() {
	document.getElementById('centeredDiv').style.display = 'block'; // or 'flex' if you prefer
	document.getElementById('overlay').classList.add('visible');
}

function submitForm() {
	closeDiv();
	// alert('Form submitted!');
}

function addInputPair(labelText) {
	const container = document.getElementById('inputContainer');
	const div = document.createElement('div');
	div.className = 'input-pair';

	const label = document.createElement('label');
	label.textContent = labelText;

	const input = document.createElement('input');
	input.type = 'text';

	div.appendChild(label);
	div.appendChild(input);
	container.appendChild(div);
}

addInputPair('Text line 1:');
addInputPair('Text line 2:');

function correctAnswer() {
    const card = document.getElementById('quiz-card');
    card.classList.add("hidden");
    Swal.fire({
        title: 'Correct!',
        text: 'Good job!',
        icon: 'success',
        confirmButtonText: 'Next'
    }).then((result) => {
        if (result.isConfirmed) {
            setTimeout(() => {
                // Callback function after 500ms delay
                card.classList.remove("hidden");
                console.log('User pressed the confirm button after 500ms');
                // You can add any action you want here, like resetting the question
            }, 500);
        }
    });
	fireConfetti();
    // confetti({
    //     particleCount: 200,
    //     spread: 500,
    //     origin: { y: 0.6 }
    // });
}

function fireConfetti() {
	const myConfetti = confetti.create(null, { resize: true, useWorker: true });
	myConfetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 }
	});

	const confettiCanvas = document.querySelector('canvas:not(#fullscreenCanvas)');
	if (confettiCanvas) {
		confettiCanvas.style.zIndex = '1000'; // Set your desired z-index value
	}
}

function incorrectAnswer() {
    const card = document.getElementById('quiz-card');
    card.classList.add("hidden");
    Swal.fire({
        title: 'Incorrect!',
        text: 'Try again!',
        icon: 'error',
        confirmButtonText: 'Retry'
    }).then((result) => {
        if (result.isConfirmed) {
            setTimeout(() => {
                // Callback function after 500ms delay
                card.classList.remove("hidden");
                console.log('User pressed the confirm button after 500ms');
                // You can add any action you want here, like resetting the question
            }, 500);
        }
    });
}

function openCard() {
    // const card = document.getElementById('quiz-card');
    // const overlay = document.getElementById('overlay');
    // card.classList.remove("hidden");
    // overlay.classList.add("visible");
    if(jsonFileContent) {
        document.getElementById('quiz-card').classList.remove("hidden");
        document.getElementById('overlay').classList.add('visible');
        fillQuizCard('Hola!', "Hola Pipiska!", ["привет", "тутуту", "колбаска", "ура"]);
    } else {
        console.log('Open file to start quiz');
    }
}

function closeCard() {
    document.getElementById('quiz-card').classList.add("hidden");
	document.getElementById('overlay').classList.remove('visible');
}
closeCard();

function shuffleArray(array) {
    for (let i=array.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// answer[0] should be correct
function fillQuizCard(word, example, answers) {
    const answer0 = answers[0];
    const shuffledArray = shuffleArray(answers);
    document.getElementById('quiz-word').innerHTML = word;
    document.getElementById('quiz-example').innerHTML = `Example: ${example}`;
    console.log(shuffledArray, correctAnswer);
    for(let i=0; i<4; i++) {
        const answer = document.getElementById(`quiz-answer${i}`);
        answer.innerHTML = shuffledArray[i];
        if(shuffledArray[i] == answer0) {
            answer.onclick = function() {correctAnswer();};
        } else {
            answer.onclick = function() {incorrectAnswer();};
        }
    }
    // document.getElementById('quiz-answer0').innerHTML = shuffledArray[0];
    // document.getElementById('quiz-answer1').innerHTML = shuffledArray[1];
    // document.getElementById('quiz-answer2').innerHTML = shuffledArray[2];
    // document.getElementById('quiz-answer3').innerHTML = shuffledArray[3];
}

function openFile() {
  	let input = document.createElement('input');
  	input.type = 'file';
    input.accept = '.json';
  	input.onchange = (event) => {
		const file = event.target.files[0];
        const reader = new FileReader();
		reader.onload = (e) => {
            // try {
                jsonFileContent = JSON.parse(e.target.result);
                console.log('Uploaded JSON:', jsonFileContent);
                // set_graph(jsonFileContent);
        };
        reader.readAsText(file);
	};
  	input.click();
  
}