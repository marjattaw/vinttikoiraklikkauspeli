let score = 0;

const dog = document.getElementById("dog");
const scoreDisplay = document.getElementById("score");

// Lisää pisteitä ja hyppyanimaatio koiralle, kun sitä klikataan
dog.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;

    // Lisää hyppyanimaatio
    dog.classList.add("jump");

    // Poista hyppy luokan 300 ms jälkeen
    setTimeout(() => {
        dog.classList.remove("jump");
    }, 300);
});
document.getElementById("dog").addEventListener("click", function (event) {
    // Luo uusi "1p" elementti
    const scorePopup = document.createElement("span");
    scorePopup.innerText = "1p";
    scorePopup.classList.add("score-popup");

    // Aseta popup-teksti koordinaatteihin, missä klikattiin
    scorePopup.style.left = event.clientX + "px";
    scorePopup.style.top = event.clientY + "px";

    // Lisää elementti bodyyn
    document.body.appendChild(scorePopup);

    // Poista elementti sekunnin kuluttua
    setTimeout(() => {
        scorePopup.style.opacity = 0; // Häivytä näkyvyys
        setTimeout(() => scorePopup.remove(), 1000); // Poista elementti DOMista
    }, 1000);
});
