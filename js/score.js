document.addEventListener("DOMContentLoaded", () => {
    let score = Number(localStorage.getItem("score")) || 0;
    localStorage.setItem("score", score);

    const scoreElement = document.getElementById("score");
    scoreElement.textContent = score;

    // console.log(localStorage.getItem("score"));
})