const words = [
    "Goku", "Pájaro", "Css", "Fuego", "Palillos", "Fresas", "Agua",
    "Digimon", "Ordenador", "Ventana", "Coche", "Moto", "Casco",
    "Entrenar", "Flexiones", "Dominadas", "Incendio", "Elíxir",
    "Extinción", "Nube", "Cartera", "Jesus", "AMEN", "Taladro"
].map(word => word.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

// const words = ["pepe", "lolo"].map(word => word.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

let currentWord = "";
let guessedWord = [];
let attemptsLeft = 10; // 10 vidas
let currentTable1Image = 5; // Para la mesa de abajo
let currentTable2Image = 5; // Para la mesa de arriba
let aciertos = 0;

// Elementos del DOM
const wordDisplay = document.getElementById("word-display");
const letters = document.getElementById("letters");
const lettersContainer = document.getElementById("letters-container");
const messageDisplay = document.getElementById("message");
const table1 = document.getElementById("table1"); // Mesa abajo
const table2 = document.getElementById("table2"); // Mesa arriba
const hangmanrope = document.getElementById("hangman-rope"); //Img ahorcado
const hangmanVideo = document.getElementById("hangman-video"); // Video perdiste
const restartButton = document.getElementById("restart-button");
const continuarButton = document.getElementById("continuar-button");
const menuModosButton = document.getElementById("selection-mode");
const guessedLettersContainer = document.createElement("div"); // Contenedor para las letras adivinadas
const contenedorAciertos = document.getElementById("victorias");

function goToIndex() {
    window.location.href = "../../index.html";
}

function initializeGame() {
    lettersContainer.style.display = "block";
    restartButton.style.display = "none";
    continuarButton.style.display = "none";
    // Generar una palabra aleatoria
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(currentWord.length).fill("_");
    wordDisplay.textContent = guessedWord.join(" ");

    // Limpiar contenedor de letras adivinadas y botones
    guessedLettersContainer.innerHTML = "";
    letters.innerHTML = "";

    // Crear botones de letras
    for (let i = 65; i <= 90; i++) {
        const button = document.createElement("button");
        button.textContent = String.fromCharCode(i);
        button.classList.add("letter-button");
        button.addEventListener("click", () => handleLetterClick(button));
        letters.appendChild(button);
    }

    // Mostramos las mesas y reiniciamos las imágenes
    table1.src = `../img/mesa ${currentTable1Image}.png`;
    table2.src = `../img/mesa ${currentTable2Image}.png`;
    hangmanrope.src = "../img/horca.png"; // Horca sin animación

    // Limpiamos cualquier mensaje de ganar o perder
    messageDisplay.style.display = "none";
    restartButton.style.display = "none";
    continuarButton.style.display = "none";
    hangmanrope.src = "../img/horca.png";

    // Limpiamos el historial de letras adivinadas
    guessedLettersContainer.innerHTML = "";
    document.getElementById("game-container").appendChild(guessedLettersContainer);
    
   
}

function handleLetterClick(button) {
    const letter = button.textContent.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    button.disabled = true; 
    let found = false;

    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            guessedWord[i] = letter;
            found = true;
        }
    }

    if (found) {
        wordDisplay.textContent = guessedWord.join(" ");
        button.style.backgroundColor = "green"; 
        addGuessedLetter(letter, true);
        if (!guessedWord.includes("_")) {
            messageDisplay.textContent = "¡Ganaste!";
            aciertos++;
            contenedorAciertos.textContent = "Has ganado " + aciertos + " veces.";
            endGame();
        }
    } else {
        attemptsLeft--;
        button.style.backgroundColor = "red";
        addGuessedLetter(letter, false);
        updateTable();
    }
}

function addGuessedLetter(letter, isCorrect) {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.color = isCorrect ? "green" : "red";
    span.style.marginRight = "8px";
    span.style.fontSize = "1.2em";
    guessedLettersContainer.appendChild(span);
}

function updateTable() {
    
    // Usamos la mesa 1 en los primeros 5 fallos
    if (attemptsLeft <= 5 && table1.style.display !== "none") {
        table1.style.display = "none"; // Ocultar mesa 1
        table2.style.display = "block"; // Mesa 2 sigue visible
    }

    // Cambiar las imágenes de las mesas según los fallos
    if (attemptsLeft > 5) {
        currentTable1Image--;
        table1.src = `../img/mesa ${currentTable1Image}.png`; // Cambiar imagen de la mesa 1
    } else if (attemptsLeft < 5) {
        currentTable2Image--;
        table2.src = `../img/mesa ${currentTable2Image}.png`; // Cambiar imagen de la mesa 2
    }

    // Si se llegan a 0 intentos, se termina el juego
    if (attemptsLeft === 0) {
        
        table1.style.display = "none"; // Ocultar mesa 1
        table2.style.display = "none"; // Ocultar mesa 2
        wordDisplay.style.display = "none";

        hangmanVideo.muted = false;
        hangmanrope.style.display = "none"; //Ocultamos img ahorcado
        hangmanVideo.style.display = "block"; // Mostramos video perdiste
        hangmanVideo.play();
        
        messageDisplay.style.display = "block";
        messageDisplay.textContent = "¡Perdiste!";
        messageDisplay.style.fontSize = "30px";
        
        showCorrectWord();
        endGame();
    }
}


function showCorrectWord() {
    const correctWordMessage = document.createElement("p");
    correctWordMessage.textContent = `La palabra era: ${currentWord.toUpperCase()}`;
    correctWordMessage.style.color = "red";
    correctWordMessage.style.fontSize = "1.5em";
    correctWordMessage.style.textAlign = "center";
    guessedLettersContainer.appendChild(correctWordMessage);
}


menuModosButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});


function endGame() {
     
    lettersContainer.style.display = "none";  
    restartButton.style.display = "block";
    continuarButton.style.display = "block";
    if(attemptsLeft === 0){
        continuarButton.style.display = "none";
    }
    restartButton.addEventListener("click", () => location.reload());
    continuarButton.addEventListener("click", () => {
        initializeGame(); 
    });
}

initializeGame();