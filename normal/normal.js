const words = [
    "Goku", "Pájaro", "Css", "Fuego", "Palillos", "Fresas", "Agua",
    "Digimon", "Ordenador", "Ventana", "Coche", "Moto", "Casco",
    "Entrenar", "Flexiones", "Dominadas", "Incendio", "Elíxir",
    "Extinción", "Nube", "Cartera", "Jesus", "AMEN", "Taladro"
].map(word => word.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

let currentWord = "";
let guessedWord = [];
let attemptsLeft = 5; // Numero de vidas
let currentTableImage = 5;

const wordDisplay = document.getElementById("word-display");
const letters = document.getElementById("letters");
const lettersContainer = document.getElementById("letters-container");
const messageDisplay = document.getElementById("message");
const table = document.getElementById("table"); // Mesa
const hangmanRope = document.getElementById("hangman-rope"); //Img ahorcado
const hangmanVideo = document.getElementById("hangman-video"); // Video perdiste
const restartButton = document.getElementById("restart-button");
const menuModosButton = document.getElementById("selection-mode");
const guessedLettersContainer = document.createElement("div"); // Contenedor para las letras adivinadas

function goToIndex() {
    window.location.href = "../../index.html";
}

function initializeGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(currentWord.length).fill("_");
    wordDisplay.textContent = guessedWord.join(" ");
    letters.innerHTML = "";
    guessedLettersContainer.innerHTML = ""; // Resetear letras adivinadas
    guessedLettersContainer.id = "guessed-letters";
    guessedLettersContainer.style.marginTop = "20px";
    document.getElementById("game-container").appendChild(guessedLettersContainer);

    // Crear botones de letras
    for (let i = 65; i <= 90; i++) {
        const button = document.createElement("button");
        button.textContent = String.fromCharCode(i);
        button.classList.add("letter-button");
        button.addEventListener("click", () => handleLetterClick(button));
        letters.appendChild(button);
    }

    // Configuración inicial de la mesa
    table.src = `../img/mesa ${currentTableImage}.png`; // Inicia con la mesa completa
}

function handleLetterClick(button) {
    const letter = button.textContent.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    button.disabled = true; // Desactivamos el botón
    let found = false;

    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            guessedWord[i] = letter;
            found = true;
        }
    }

    if (found) {
        wordDisplay.textContent = guessedWord.join(" ");
        button.style.backgroundColor = "green"; // Marcar botón en verde si esta bien
        addGuessedLetter(letter, true);
        if (!guessedWord.includes("_")) {
            messageDisplay.textContent = "¡Ganaste!";
            endGame();
        }
    } else {
        attemptsLeft--;
        button.style.backgroundColor = "red"; // Marcar botón en rojo si esta mal
        addGuessedLetter(letter, false);
        updateTable();
    }
}

// Añadir letra al historial
function addGuessedLetter(letter, isCorrect) {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.color = isCorrect ? "green" : "red";
    span.style.marginRight = "8px";
    span.style.fontSize = "1.2em";
    guessedLettersContainer.appendChild(span);
}

// Actualizar la mesa y el ahorcado
function updateTable() {

    
    if (currentTableImage > 1) {
        currentTableImage--;
        table.src = `../img/mesa ${currentTableImage}.png`; // Cambiar imagen de la mesa
    } else {
        table.style.display = "none"; // Ocultar la mesa
        wordDisplay.style.display = "none";

        hangmanVideo.muted = false;
        hangmanRope.style.display = "none"; //Ocultamos img ahorcado
        hangmanVideo.style.display = "block"; // Mostramos video perdiste
        hangmanVideo.play();

        messageDisplay.textContent = "¡Perdiste!";
        messageDisplay.style.fontSize = "30px";
        showCorrectWord(); // Mostrar la palabra correcta
        endGame();
    }
}

// Mostrar la palabra correcta al perder
function showCorrectWord() {
    // Limpiar completamente el contenedor principal
    lettersContainer.innerHTML = "";

    // Crear un nuevo párrafo con el mensaje de la palabra correcta
    const correctWordMessage = document.createElement("p");
    correctWordMessage.textContent = `La palabra era: ${currentWord.toUpperCase()}`;
    correctWordMessage.style.color = "red";
    correctWordMessage.style.fontSize = "1.5em";
    correctWordMessage.style.textAlign = "center";

    // Añadir el mensaje al contenedor principal
    lettersContainer.appendChild(correctWordMessage);
}

menuModosButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

function endGame() {
    showCorrectWord(); // Mostrar la palabra correcta
    restartButton.style.display = "block";
    restartButton.addEventListener("click", () => location.reload());
}

initializeGame();
