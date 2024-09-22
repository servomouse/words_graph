
let jsonFileContent = null;
let langs = [];
let currentLang = null;

// Add the sample method to arrays to select a random element
Array.prototype.sample = function() {
    return this[Math.floor(Math.random()*this.length)];
  }

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

function getNextIdx(idx, array) {
    let newIdx = idx + 1;
    if(newIdx >= array.length) {
        newIdx = 0;
    }
    return newIdx;
}

function showDiv() {
    const elements = document.getElementsByClassName("input-pair");
    // const elements = document.getElementsByClassName("input-label");
    // const elements = document.getElementsByClassName("input-input");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    let idx = langs.indexOf(currentLang);
    for(let i=0; i<langs.length; i++) {
        addInputPair(langs[idx]);
        idx = getNextIdx(idx, langs);
    }
    addInputPair("example");
	document.getElementById('centeredDiv').style.display = 'block'; // or 'flex' if you prefer
	document.getElementById('overlay').classList.add('visible');
}

function submitForm() {
    const newWord = document.getElementById(`new_word_${currentLang}`).value.split('; ')[0];    // Use only one word
    const example = document.getElementById(`new_word_example`).value;
    if(!jsonFileContent[currentLang].hasOwnProperty(newWord)) {
        jsonFileContent[currentLang][newWord] = {};
        jsonFileContent[currentLang][newWord].example = example;
        jsonFileContent[currentLang][newWord].translations = {};
        jsonFileContent[currentLang][newWord].coords = {"x": 100, "y": 100};
    }
    console.log(newWord, example);
    function processLang(lang, index, array) {
        if(lang == currentLang) {
            return;
        }
        const words = document.getElementById(`new_word_${lang}`).value.split('; ');
        for(let i=0; i<words.length; i++) {
            if(!jsonFileContent[currentLang][newWord].translations.hasOwnProperty(lang)) {
                jsonFileContent[currentLang][newWord].translations[lang] = {};
            }
            if(!jsonFileContent[currentLang][newWord].translations[lang].hasOwnProperty(words[i])) {
                jsonFileContent[currentLang][newWord].translations[lang][words[i]] = 0;
            }
            if(!jsonFileContent[lang].hasOwnProperty(words[i])) {
                jsonFileContent[lang][words[i]] = {};
                jsonFileContent[lang][words[i]].translations = {};
                // jsonFileContent[lang][words[i]].translations[currentLang] = {};
                jsonFileContent[lang][words[i]].coords = {"x": 100, "y": 100};
                jsonFileContent[lang][words[i]].example = null;
            }
            if(!jsonFileContent[lang][words[i]].translations.hasOwnProperty(currentLang)) {
                jsonFileContent[lang][words[i]].translations[currentLang] = {};
            }
            if(!jsonFileContent[lang][words[i]].translations[currentLang].hasOwnProperty(newWord)) {
                jsonFileContent[lang][words[i]].translations[currentLang][newWord] = 0;
            }
        }
        document.getElementById(`new_word_${lang}`).value = '';
        console.log(words);
    }
    langs.forEach(processLang);
    // for(const lang in langs) {
    //     console.log(langs);
    //     const words = document.getElementById(`new_word_${lang}`).innerHTML;
    //     console.log(words);
    // }
	closeDiv();
	// alert('Form submitted!');
}

function addInputPair(labelText) {
	const container = document.getElementById('inputContainer');
	const div = document.createElement('div');
	div.className = 'input-pair';

	const label = document.createElement('label');
    if(labelText === currentLang) {
	    label.textContent = `Word in ${labelText}:`;
    } else if(labelText === "example") {
	    label.textContent = "Example:";
    } else {
	    label.textContent = `Translation to ${labelText}:`;
    }
    label.className = "input-label";
    
	const input = document.createElement('input');
	input.type = 'text';
	input.id = `new_word_${labelText}`;
    input.className = "input-input";

	div.appendChild(label);
	div.appendChild(input);
	container.appendChild(div);
}

// addInputPair('Text line 1:');
// addInputPair('Text line 2:');

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
                fillQuizCard();
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
                fillQuizCard();
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
        fillQuizCard();
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

function getWord() {
    // Get language
    let idx = langs.indexOf(currentLang) + 1;
    if(idx == langs.length) {
        idx = 0;
    }
    currentLang = langs[idx];
    // Select a word
    let words = [];
    for(const langWord in jsonFileContent[currentLang]) {
        words.push(langWord);
    }
    const word = words.sample();
    // Select second language
    let secLangs = [];
    console.log(jsonFileContent[currentLang][word].translations);
    for(const lang in jsonFileContent[currentLang][word].translations) {
        console.log(lang);
        secLangs.push(lang);
    }
    const secLang = secLangs.sample();
    // Select correct translation
    let translations = [];
    console.log(jsonFileContent[currentLang][word].translations, secLangs);
    for(const transl in jsonFileContent[currentLang][word].translations[secLang]) {
        translations.push(transl);
    }
    const correctAnswer = translations.sample();
    console.log(translations, correctAnswer);
    // Get other words from the second language
    let altTrans = [];
    for(const transl in jsonFileContent[secLang]) {
        altTrans.push(transl);
    }
    // Select wrong answers
    let answers = [correctAnswer];
    let counter = 0;
    while(answers.length < 4 && counter < 8) {
        const spl = altTrans.sample();
        console.log(answers, spl);
        if((!answers.includes(spl) || counter > 4) && !translations.includes(spl)) {
            answers.push(spl);
        }
    }
    return [word, jsonFileContent[currentLang][word].example, answers];
}

// answer[0] should be correct
function fillQuizCard() {
    const [word, example, answers] = getWord();
    const answer0 = answers[0];
    const shuffledArray = shuffleArray(answers);
    document.getElementById('quiz-word').innerHTML = word;
    if(example != null) {
        document.getElementById('quiz-example').innerHTML = `Example: ${example}`;
    } else {
        document.getElementById('quiz-example').innerHTML = "";
    }
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
}

function addLang(lang) {
    if(langs.includes(lang)) {
        return;
    }
    langs.push(lang);
    const cbUnit = document.createElement('label');
    cbUnit.className = 'checkbox-unit';
    cbUnit.id = `${lang}_lang`;
    cbUnit.innerHTML = `${lang.toUpperCase()}<input type="checkbox"><span class="checkmark"></span>`;
    document.getElementById('checkbox-container').appendChild(cbUnit);
}

function openFile() {
  	let input = document.createElement('input');
  	input.type = 'file';
    input.accept = '.json';
  	input.onchange = (event) => {
		const file = event.target.files[0];
        const reader = new FileReader();
		reader.onload = (e) => {
                jsonFileContent = JSON.parse(e.target.result);
                console.log('Uploaded JSON:', jsonFileContent);
                for (const lang in jsonFileContent) {
                    addLang(lang);
                    currentLang = langs[0];
                    // addInputPair(lang);
                }
        };
        reader.readAsText(file);
        addInputPair("Example");
	};
  	input.click();
  
}

function saveFile() {
    const blob = new Blob([JSON.stringify(jsonFileContent, null, 4)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'words.json';
    link.click();
}