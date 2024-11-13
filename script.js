// Alustetaan pistemäärä
let score = parseInt(localStorage.getItem('score')) || 0;
const scoreDisplay = document.getElementById("score");
scoreDisplay.textContent = score;

const dog = document.getElementById("dog");
const explosion = document.getElementById("explosion");

// Luodaan audiokomponentti koiran haukkumiselle
const barkSound = new Audio("voices/koirahaukku.mp3");

dog.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    localStorage.setItem('score', score);

    // Soitetaan ääni klikkauksen yhteydessä
    barkSound.play();

    // Lisää pomppuefekti klikkauksen yhteydessä
    dog.classList.add("jump");
    setTimeout(() => {
        dog.classList.remove("jump");
    }, 300);

    // Näytetään piste-popup (valinnainen)
    const scorePopup = document.createElement("span");
    scorePopup.innerText = "1p";
    scorePopup.classList.add("score-popup");

    // Aseta popupin sijainti koiran yläpuolelle
    const rect = dog.getBoundingClientRect();
    scorePopup.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    scorePopup.style.top = `${rect.top + window.scrollY - 20}px`;
    document.body.appendChild(scorePopup);

    // Häivytä ja poista popup
    setTimeout(() => {
        scorePopup.style.opacity = 0;
        setTimeout(() => scorePopup.remove(), 1000);
    }, 1000);

    // Tarkista, onko pistemäärä 100:n monikerta (100, 200, 300, ...)
    if (score % 100 === 0) {
        // Aktivoi räjähdysanimaatio
        explosion.classList.add("explode");

        // Poista räjähdysanimaatio 0.5 sekunnin kuluttua, jotta se voidaan aktivoida uudelleen
        setTimeout(() => {
            explosion.classList.remove("explode");
        }, 500);
    }
});
