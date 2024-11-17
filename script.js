const normalButton = document.getElementById('normal-mode');
const survivalButton = document.getElementById('survival-mode');

function startGame(mode) {
    
    const page = mode === 'normal' ? "normal/normal.html" : "hard/survival.html"; 
    window.location.href = `${page}?mode=${mode}`;
}

normalButton.addEventListener('click', () => startGame('normal'));
survivalButton.addEventListener('click', () => startGame('survival'));

function goToIndex() {
    window.location.href = "../../index.html";
}