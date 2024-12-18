// Viittaukset säännöt-modaliin
const rulesButton = document.getElementById("rules-button");
const rulesModal = document.getElementById("rules-modal");
const closeButton = document.querySelector(".close-button");

// Näytä modal
rulesButton.addEventListener("click", () => {
    rulesModal.style.display = "block";
});

// Sulje modal ruksista
closeButton.addEventListener("click", () => {
    rulesModal.style.display = "none";
});

// Sulje modal klikkaamalla ulkopuolelle
window.addEventListener("click", (event) => {
    if (event.target === rulesModal) {
        rulesModal.style.display = "none";
    }
});

// Alustetaan pistemäärä
let score = parseInt(localStorage.getItem('score')) || 0;
const scoreDisplay = document.getElementById("score");
const clicksPerSecondDisplay = document.getElementById("clicks-per-second"); // Viittaus klikkausnäyttöön
scoreDisplay.textContent = score;

// Viittaukset nappeihin
const autoCursorButton = document.querySelector("#auto-cursor");
const superCursorButton = document.querySelector("#super-cursor");
const maxispeedEnzioButton = document.querySelector("#maxispeed-enzio");
const madEnzioButton = document.querySelector("#mad-enzio");
const rageEnzioButton = document.querySelector("#rage-enzio");
const energyTreatButton = document.querySelector("#energy-treat"); // Energianami
const resetButton = document.querySelector(".reset-button");

// Muuttujat
let autoCursorCount = 0;
let superCursorCount = 0;
let autoClickInterval;
let userClicksThisSecond = 0;
let energyTreatActive = false; // Energianamien tilan hallinta

// Luodaan audiokomponentti koiran haukkumiselle
const barkSound = new Audio("voices/koirahaukku.mp3");

// Lasketaan klikkauksia sekunnissa
function calculateClicksPerSecond() {
    const autoClicks = autoCursorCount + superCursorCount * 2;
    const totalClicks = autoClicks + userClicksThisSecond; // Yhdistetään automaattiset ja käyttäjän klikkaukset
    clicksPerSecondDisplay.textContent = totalClicks.toFixed(2); // Näytetään kahden desimaalin tarkkuudella
    userClicksThisSecond = 0; // Nollaa käyttäjän klikkaukset laskennan jälkeen
}

// Päivitetään klikkaukset sekunnissa automaattisesti
setInterval(() => {
    calculateClicksPerSecond();
}, 1000);

// Lataa tallennetut kursorien määrät
autoCursorCount = parseInt(localStorage.getItem('autoCursorCount')) || 0;
superCursorCount = parseInt(localStorage.getItem('superCursorCount')) || 0;

// Käynnistä automaattikursorit, jos niitä on tallennettu
if (autoCursorCount > 0 || superCursorCount > 0) {
    startAutoCursor();
}

// Automaattikursorin toiminnallisuus
autoCursorButton.addEventListener("click", () => {
    const autoCursorCost = 200; // Hinta automaattikursorille
    if (score >= autoCursorCost) {
        score -= autoCursorCost; // Vähennä pisteitä
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        autoCursorCount++; // Lisää automaattikursorien määrä
        localStorage.setItem('autoCursorCount', autoCursorCount); // Tallenna määrä
        startAutoCursor(); // Käynnistä automaattikursorin toiminta
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä automaattikursoriin!");
    }
});

// Käynnistää automaattikursorin toiminnan
function startAutoCursor() {
    if (!autoClickInterval) {
        autoClickInterval = setInterval(() => {
            score += autoCursorCount; // Lisää pisteitä automaattisesti
            scoreDisplay.textContent = score;
            localStorage.setItem('score', score);
        }, 1000); // Pisteet lisätään kerran sekunnissa
    }
}

// Superautomaattikursorin toiminnallisuus
superCursorButton.addEventListener("click", () => {
    const superCursorCost = 500; // Hinta superautomaattikursorille
    if (score >= superCursorCost) {
        score -= superCursorCost; // Vähennä pisteitä
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        superCursorCount++; // Lisää superautomaattikursorien määrä
        localStorage.setItem('superCursorCount', superCursorCount); // Tallenna määrä
        startSuperCursor(); // Käynnistä superautomaattikursorin toiminta
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä superautomaattikursoriin!");
    }
});

// Käynnistää superautomaattikursorin toiminnan
function startSuperCursor() {
    if (!autoClickInterval) {
        autoClickInterval = setInterval(() => {
            const superCursorPoints = superCursorCount * 2; // Jokainen superkursori antaa 2 pistettä
            score += autoCursorCount + superCursorPoints; // Lisää pisteitä automaattisesti
            scoreDisplay.textContent = score;
            localStorage.setItem('score', score);
        }, 1000); // Pisteet lisätään kerran sekunnissa
    }
}

// Energianamien toiminnallisuus
energyTreatButton.addEventListener("click", () => {
    const energyTreatCost = 10000;

    if (score >= energyTreatCost) {
        score -= energyTreatCost;
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        activateEnergyTreat(); // Aktivoi energianamit
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä energianameihin!");
    }
});

function activateEnergyTreat() {
    if (energyTreatActive) return; // Estä päällekkäinen aktivointi
    energyTreatActive = true;

    const originalAddScore = addScore; // Tallenna alkuperäinen funktio
    addScore = function (playSound, extraPoints = 0) {
        originalAddScore(playSound, extraPoints * 2); // Tuplaa kaikki klikkaukset
    };

    // Poista tehoste 30 sekunnin jälkeen
    setTimeout(() => {
        addScore = originalAddScore; // Palauta alkuperäinen funktio
        energyTreatActive = false;
    }, 30000); // 30 sekuntia
}

// Rage Enzion toiminnallisuus: Villien nakkien hyökkäys
rageEnzioButton.addEventListener("click", () => {
    const rageEnzioCost = 100;

    if (score >= rageEnzioCost) {
        score -= rageEnzioCost;
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        activateWildSausages(); // Käynnistä villien nakkien hyökkäys
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä Rage Enzion ostamiseen!");
    }
});
function activateWildSausages() {
    const body = document.querySelector("body");
    const totalSausages = 20; // Kuinka monta nakkia luodaan
    const duration = 10000; // 10 sekuntia
    const sausages = [];

    body.classList.add("rage-active"); // Vaihda taustakuva
    console.log("Rage Enzio aktivoitu!");

    // Luo nakit ja lisää ne näytölle
    for (let i = 0; i < totalSausages; i++) {
        const sausage = document.createElement("img");
        sausage.src = "images/sausage.jpg";
        sausage.classList.add("wild-sausage");
        document.body.appendChild(sausage);

        // Aseta nakki satunnaiseen paikkaan
        randomizeSausagePosition(sausage);

        // Lisää klikkaustoiminto
        sausage.addEventListener("click", () => {
            score += 100; // Jokainen nakki antaa 100 pistettä
            scoreDisplay.textContent = score;
            localStorage.setItem('score', score);
            sausage.remove(); // Poista nakki klikkauksen jälkeen
        });

        sausages.push(sausage);
    }

    // Poista kaikki nakit ja palauta tausta, kun aika loppuu
    setTimeout(() => {
        sausages.forEach((sausage) => sausage.remove());
        body.classList.remove("rage-active");
        console.log("Rage Enzion tila päättyi!");
    }, duration);
}

// Mad Enzion toiminnallisuus
madEnzioButton.addEventListener("click", () => {
    const madEnzioCost = 200;

    if (score >= madEnzioCost) {
        score -= madEnzioCost;
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        activateMadEnzio(); // Käynnistä Mad Enzion toiminnallisuus
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä Mad Enzion ostamiseen!");
    }
});

function activateMadEnzio() {
    const body = document.querySelector("body");

    console.log("Mad Enzio aktivoitu!");
    body.classList.add("mad-active"); // Vaihda taustakuva

    setTimeout(() => {
        body.classList.remove("mad-active");
        console.log("Mad Enzion tila päättyi!");
    }, 30000); // 30 sekuntia
}

// Maxispeed Enzion toiminnallisuus
maxispeedEnzioButton.addEventListener("click", () => {
    const maxispeedCost = 300;

    if (score >= maxispeedCost) {
        score -= maxispeedCost;
        scoreDisplay.textContent = score;
        localStorage.setItem('score', score);

        activateMaxispeedEnzio(); // Käynnistä Maxispeed Enzion toiminnallisuus
    } else {
        alert("Sinulla ei ole tarpeeksi pisteitä Maxispeed Enzion ostamiseen!");
    }
});

function activateMaxispeedEnzio() {
    const body = document.querySelector("body");

    console.log("Maxispeed Enzio aktivoitu!");
    body.classList.add("maxispeed-active"); // Vaihda taustakuva

    const originalAddScore = addScore; // Tallenna alkuperäinen pisteidenlisäysfunktio

    // Korvataan addScore-funktio tuplaamaan pisteet
    addScore = function (playSound, extraPoints = 0) {
        originalAddScore(playSound, extraPoints * 2); // Tuplaa kaikki pisteet
    };

    // Tehoste loppuu 20 sekunnin jälkeen
    setTimeout(() => {
        addScore = originalAddScore; // Palautetaan normaali pisteidenlisäys
        body.classList.remove("maxispeed-active"); // Poistetaan visuaalinen tehoste
        console.log("Maxispeed Enzio tehoste päättyi!");
    }, 20000); // 20 sekuntia
}

// Funktio saussien satunnaiselle sijainnille
function randomizeSausagePosition(element) {
    const randomX = Math.random() * (window.innerWidth - 50); // Leveys, pois reunoilta
    const randomY = Math.random() * (window.innerHeight - 50); // Korkeus, pois reunoilta
    element.style.position = "absolute";
    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
}

// Pisteiden lisääminen ja pomppuanimaatio, kun kuvaa klikataan
const dog = document.getElementById("dog");

dog.addEventListener("click", () => {
    userClicksThisSecond++; // Lisää käyttäjän klikkaus laskuriin
    addScore(true); // Soittaa äänen klikkauksen yhteydessä

    dog.style.animation = "none"; // Poistetaan idle-animaatio
    dog.classList.remove("jump");
    void dog.offsetWidth; // Nollaa DOM
    dog.classList.add("jump");
    setTimeout(() => {
        dog.style.animation = ""; // Palautetaan idle-animaatio
    }, 300); // 300 ms odotus klikkausanimaation jälkeen
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
}

// Nollaa pisteet -painikkeen tapahtumankäsittelijä
resetButton.addEventListener("click", () => {
    score = 0;
    autoCursorCount = 0;
    superCursorCount = 0;
    clearInterval(autoClickInterval);
    scoreDisplay.textContent = score;
    clicksPerSecondDisplay.textContent = "0.00"; // Resetoi tarkkuudella
    localStorage.removeItem('score');
});
