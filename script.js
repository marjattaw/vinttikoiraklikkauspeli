// Alustetaan pistemäärä
let score = parseInt(localStorage.getItem('score')) || 0;
const scoreDisplay = document.getElementById("score");
scoreDisplay.textContent = score;

const dog = document.getElementById("dog");
const explosion = document.getElementById("explosion");

// Luodaan audiokomponentti koiran haukkumiselle
const barkSound = new Audio("voices/koirahaukku.mp3");

// Pisteiden lisääminen ja pomppuanimaatio, kun kuvaa klikataan
dog.addEventListener("click", () => {
    addScore(true); // Soittaa äänen klikkauksen yhteydessä
    
    // Lisää pomppuefekti klikkauksen yhteydessä
    dog.classList.add("jump");
    setTimeout(() => {
        dog.classList.remove("jump");
    }, 300);
});

// Toiminto pisteiden lisäämiseksi
function addScore(playSound) {
    score++;
    scoreDisplay.textContent = score;
    localStorage.setItem('score', score);

    // Soitetaan ääni vain, jos klikkaus tulee pelaajalta (playSound = true)
    if (playSound) {
        barkSound.play();
    }

    // Tarkista, onko pistemäärä 100:n monikerta (100, 200, 300, ...)
    if (score % 100 === 0) {
        createFloatingSausage(); // Luo uusi nakki jokaisen 100 pisteen jälkeen
    }
}

// Luo leijuva nakki ja aseta satunnaiseen paikkaan
function createFloatingSausage() {
    const newSausage = document.createElement("img");
    newSausage.src = "images/sausage.jpg";
    newSausage.classList.add("floating-sausage");
    document.body.appendChild(newSausage);

    // Sijoita nakki satunnaiseen kohtaan
    const randomX = Math.random() * (window.innerWidth - 50); // Aseta leveys 50px mukaan
    const randomY = Math.random() * (window.innerHeight - 50);
    newSausage.style.left = `${randomX}px`;
    newSausage.style.top = `${randomY}px`;

    // Lisää tapahtumankäsittelijä nakin klikkaukseen
    newSausage.addEventListener("click", () => {
        score += 10; // Lisää 10 pistettä
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        // Poista nakki klikkauksen jälkeen
        newSausage.remove();
    });
}

// Lisää elementti automaattikursorin ostamiseen ja nollaamiseen
const autoCursorButton = document.querySelector(".button:nth-child(1)"); // Ensimmäinen nappi "Nappi 1"
const resetButton = document.querySelector(".reset-button"); // Nollaa pisteet -nappi

// Muuttuja automaattikursoreiden määrälle
let autoCursorCount = 0;
let autoClickInterval;

// Automattikursorin oston tapahtumankäsittelijä
autoCursorButton.addEventListener("click", () => {
    const autoCursorCost = 500;

    // Tarkistetaan, onko pelaajalla tarpeeksi pisteitä automaattikursorin ostoon
    if (score >= autoCursorCost) {
        score -= autoCursorCost;
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        autoCursorCount++;
        if (autoClickInterval) clearInterval(autoClickInterval); // Poistetaan edellinen intervalli

        // Aseta uusi intervalli, joka lisää pisteitä automaattisesti ilman ääntä
        autoClickInterval = setInterval(() => {
            for (let i = 0; i < autoCursorCount; i++) {
                addScore(false); // Ei ääntä automaattisille klikkauksille
            }
        }, 1000);
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä automaattikursorin ostamiseen! Tarvitset 500 pistettä.");
    }
});

// Nollaa pisteet -painikkeen tapahtumankäsittelijä
resetButton.addEventListener("click", () => {
    score = 0;
    autoCursorCount = 0; // Nollaa automaattikurorien määrä
    clearInterval(autoClickInterval); // Lopeta automaattikursoreiden toiminta
    scoreDisplay.textContent = score;
    localStorage.removeItem('score'); // Tyhjennä paikallinen muisti
});
