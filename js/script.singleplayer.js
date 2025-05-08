document.addEventListener("DOMContentLoaded", function () {

    const categories = [
        {
            name: "Animais",
            words: ["Cão", "Gato", "Elefante", "Leão", "Tigre", "Urso", "Cavalo", "Girafa", "Zebra", "Macaco"]
        },
        {
            name: "Frutas",
            words: ["Maçã", "Banana", "Laranja", "Uva", "Pera", "Manga", "Abacaxi", "Melancia", "Cereja", "Kiwi"]
        },
        {
            name: "Países",
            words: ["Portugal", "Argentina", "França", "Alemanha", "Japão", "Índia", "Canadá", "Austrália", "Itália", "Espanha"]
        },
    ]

    let isWordGuessed = false;
    let isGameOver = false;

    let score = Number(localStorage.getItem("score")) || 0;

    let attempts = 11;
    let lettersUsed = [];
    const lettersUsedText = document.getElementById("attempted_letters");


    const LU_toastElement = document.getElementById("letters_used_toast");
    const letterUsedToast = new bootstrap.Toast(LU_toastElement);

    const EI_toastElement = document.getElementById("empty_input_toast");
    const emptyInputToast = new bootstrap.Toast(EI_toastElement);

    const attemptsText = document.getElementById("attempts");
    attemptsText.textContent = attempts;

    const modalElement = document.getElementById("game_result_modal");
    const modalTitle = document.getElementById("game_result_label");
    const modalBody = document.getElementById("game_result_body");
    const modalRestartButton = document.getElementById("restart_button_modal");
    const gameResultModal = new bootstrap.Modal(modalElement);

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomWord = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];

    console.log(`Categoria: ${randomCategory.name}`);
    console.log(`Palavra: ${randomWord}`);


    const categorySpan = document.getElementById("category");
    const letterSpans = []

    categorySpan.textContent = randomCategory.name;

    const wordContainer = document.getElementById("secret_word");


    const wordLetters = randomWord.split("").map(letter => {
        const letterSpan = document.createElement("span");
        letterSpan.textContent = "_";
        letterSpan.classList.add("letter");
        wordContainer.appendChild(letterSpan);
        letterSpans.push(letterSpan);
    })


    const userInput = document.getElementById("guess_input")
    const guessButton = document.getElementById("guess_button");
    const restartButton = document.getElementById("restart_button");
    restartButton.style.display = "none";


    guessButton.addEventListener("click", () => {
        if (isGameOver) return;

        const userGuess = userInput.value.trim().toUpperCase();
        userInput.value = "";
        userInput.focus();

        if (userGuess === "") {
            emptyInputToast.show();
            return;
        }

        if (lettersUsed.includes(userGuess)) {
            letterUsedToast.show();
            return;
        }

        lettersUsed.push(userGuess);
        // console.log(lettersUsed);
        lettersUsedText.textContent = lettersUsed.join(", ")

        if (NormalizeLetter(userGuess) === NormalizeLetter(randomWord).toUpperCase()) {
            letterSpans.forEach((letterSpan, index) => {
                letterSpan.textContent = randomWord[index];
            });
            GameWon();
            return;
        }

        let found = false;

        randomWord.split("").forEach((letter, index) => {
            if (NormalizeLetter(letter).toUpperCase() === userGuess) {
                letterSpans[index].textContent = letter;
                found = true;
            }
        });

        if (letterSpans.every(span => span.textContent !== "_")) {
            GameWon();
            return;
        }

        if (found) {
            console.log("Acertou!");
        }
        else {
            attempts--;
            console.log("Errou!");
            attemptsText.textContent = attempts;
        }

        if (attempts === 0) {
            GameOver();
        }

    });

    restartButton.addEventListener("click", () => document.location.reload(true));

    // Functions
    function GameState() {
        isGameOver = true;
        guessButton.disabled = true;
        userInput.disabled = true;
        restartButton.style.display = "block";
    }

    function GameOver() {
        GameState();

        score--;
        localStorage.setItem("score", score);
        // console.log(score);

        modalTitle.textContent = "Perdeste!";
        modalBody.textContent = `Womp womp! A palavra era "${randomWord}"`;
        gameResultModal.show();
    }

    function GameWon() {
        GameState();
        isWordGuessed = true;

        score++;
        localStorage.setItem("score", score);
        // console.log(score);

        modalTitle.textContent = "Venceste!";
        modalBody.textContent = `Parabéns! A palavra era ${randomWord}`;
        gameResultModal.show();
    }

    function NormalizeLetter(letter) {
        return letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

});