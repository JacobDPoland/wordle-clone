/**
 * Title: Wordle
 * Description: A word guessing game
 * Author: Samin Yasar
 * Date: 06/February/2022
 */

// DOM Selection
const gameSection = document.getElementById("gameSection");
const rulesButton = document.getElementById("rulesButton");
const settingsButton = document.getElementById("settingsButton");
const overlayCrossButton = document.getElementById("overlayCrossButton");
const helpOverlayContent = document.getElementById("helpOverlayContent");
const settingsOverlayContent = document.getElementById(
    "settingsOverlayContent"
);
const messageOverlayContent = document.getElementById("messageOverlayContent");
const messageContainer = document.querySelector(".message-container");
const darkModeSwitch = document.getElementById("darkModeSwitch");
const hardModeSwitch = document.getElementById("hardModeSwitch");

/**
 * Set all localstorage default values
 */
const initLocalStorage = () => {
    if (localStorage.getItem("wordle-hardMode") === null) {
        localStorage.setItem("wordle-hardMode", "false");
    }
    if (localStorage.getItem("wordle-darkMode") === null) {
        localStorage.setItem("wordle-darkMode", "false");
    }
};

// Initialize some localstorage variable if they don't exist
initLocalStorage();

// Global variables
const game = {
    hardMode:
        localStorage.getItem("wordle-hardMode") === "false" ? false : true,
    darkMode:
        localStorage.getItem("wordle-darkMode") === "false" ? false : true,
    words: ['sobre', 'entre', 'desde', 'todos', 'tiene', 'hasta', 'donde', 'parte', 'puede', 'otros', 'mismo', 'hacer', 'tanto', 'forma', 'estos', 'ahora', 'mejor', 'lugar', 'quien', 'mundo', 'menos', 'mayor', 'mucho', 'tener', 'poder', 'nuevo', 'ellos', 'todas', 'otras', 'antes', 'luego', 'estas', 'hecho', 'grupo', 'medio', 'gente', 'decir', 'nueva', 'salud', 'nivel', 'horas', 'cosas', 'hacia', 'misma', 'estar', 'final', 'veces', 'punto', 'haber', 'meses', 'datos', 'nunca', 'fecha', 'junto', 'total', 'falta', 'buena', 'tengo', 'bueno', 'casos', 'fuera', 'igual', 'hemos', 'apoyo', 'obras', 'local', 'chile', 'deben', 'trata', 'julio', 'dicho', 'estoy', 'mujer', 'cargo', 'claro', 'pesos', 'juego', 'cinco', 'valor', 'saber', 'largo', 'nadie', 'vamos', 'noche', 'hacen', 'orden', 'campo', 'tarde', 'temas', 'usted', 'serie', 'libro', 'marco', 'calle', 'santa', 'favor', 'cerca', 'marzo', 'sigue'],

    word: null,
    fetchWord: async function () {
        // fetch from api
        // const apiURL = `http://localhost:2004/`;
        // await fetch(apiURL)
        //     .then((response) => response.json())
        //     .then((data) => {
        //         this.word = data.word;
        //         this.words = data.words;
        //     });
        this.word = this.words[Math.floor(Math.random() * this.words.length)];
        console.log(this.word);
    },
    guesses: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
    },
    currentTry: 1,
    maxTries: 5,
    isGameEnd: false,
    win: false,
};

// Fetch the random word if it's not already generated
(async () => {
    !game.word ? await game.fetchWord() : null;
})();

/**
 * Generate a game popup & show it on game popup container
 *
 * @param {String} message - Error message
 */
const gamePopup = (message) => {
    messageContainer.textContent = message || "There have a message for you!.";
    showOverlay(messageOverlayContent);
};

/**
 * Print a word on a game cell
 *
 * @param {String} key - The key value
 */
const type = (key) => {
    game.guesses[game.currentTry].push(key);
    for (let i = game.currentTry * 5 - 4; i <= game.currentTry * 5; i++) {
        const currentCell = document.querySelector(`.game-cell-${i} h2`);
        currentCell.textContent =
            game.guesses[game.currentTry][i - (game.currentTry - 1) * 5 - 1];
    }
};

/**
 * Remove a word from right on game cell
 */
const remove = () => {
    game.guesses[game.currentTry].pop();
    for (let i = game.currentTry * 5 - 4; i <= game.currentTry * 5; i++) {
        const currentCell = document.querySelector(`.game-cell-${i} h2`);
        currentCell.textContent =
            game.guesses[game.currentTry][i - (game.currentTry - 1) * 5 - 1];
    }
};

/**
 * Submit a word against a try
 *
 * @param {String} text - The full word that will be submitted
 */
const submit = (text) => {
    if (game.words.includes(text)) {
        const rightCells = [];
        const wrongSpotCells = [];
        const wrongCells = [];
        // TODO: Highlight right/wrong/wrong spot letters on the screen keyboard
        const rightLetters = [];
        const wrongLetters = [];
        const wrongSpotLetters = [];

        game.word.split("").forEach((ch, index) => {
            const currentCell = document.querySelector(
                `.game-cell-${5 * game.currentTry - (5 - (index + 1))} h2`
            );
            if (ch === text.split("")[index]) {
                rightCells.push(currentCell);
                rightLetters.push(currentCell.textContent);
            } else {
                // check that if the user types any word in wrong spot
                if (text.search(ch) > -1 && !game.hardMode) {
                    // user type a character in a wrong spot
                    const wrongSpotCell = document.querySelector(
                        `.game-cell-${
                            5 * game.currentTry - (5 - (text.search(ch) + 1))
                        } h2`
                    );
                    wrongCells.push(currentCell);
                    wrongSpotCells.push(wrongSpotCell);
                    wrongLetters.push(currentCell.textContent);
                    wrongSpotLetters.push(wrongSpotCell.textContent);
                } else {
                    if (
                        !wrongSpotCells.includes(currentCell) &&
                        !wrongSpotLetters.includes(currentCell.textContent)
                    ) {
                        wrongCells.push(currentCell);
                        wrongLetters.push(currentCell.textContent);
                    }
                }
            }
        });

        rightCells.forEach((cell) => {
            cell.parentElement.classList.add("bg-primary");
            cell.classList.remove("dark:text-white");
            cell.classList.add("text-black", "dark:text-black");
        });

        wrongSpotCells.forEach((cell) => {
            cell.parentElement.classList.add("bg-yellow");
            cell.classList.remove("dark:text-white");
            cell.classList.add("text-black", "dark:text-black");
        });

        wrongCells.forEach((cell) => {
            if (!wrongSpotCells.includes(cell)) {
                cell.parentElement.classList.add("bg-red");
            }
        });

        rightLetters.forEach((letter) => {
            const selector = document.querySelector(`[data-key = "${letter}"]`);
            selector.className = "keyboard-key bg-primary text-black";
        });

        wrongSpotLetters.forEach((letter) => {
            const selector = document.querySelector(`[data-key = "${letter}"]`);
            selector.className = "keyboard-key bg-yellow text-black";
        });

        wrongLetters.forEach((letter) => {
            if (!wrongSpotLetters.includes(letter)) {
                const selector = document.querySelector(
                    `[data-key = "${letter}"]`
                );
                selector.className = "keyboard-key bg-red text-black";
            }
        });

        if (
            rightCells.length === 5 &&
            wrongCells.length === 0 &&
            wrongSpotCells.length === 0
        ) {
            // all cells is rigth / user guessed the right word
            game.isGameEnd = true;
            game.win = true;
            gamePopup(
                `You can guess the word within ${game.currentTry} tries. Refresh the page to play again.`
            );
        } else if (game.currentTry < game.maxTries) {
            // user cannot guess the right word but user have more tries
            game.currentTry++;
            game.isGameEnd = !Boolean(game.currentTry <= game.maxTries);
        } else {
            // User cannot guess the right word within maximum tries
            game.isGameEnd = true;
            gamePopup(
                `You cannot guess the correct word. The word is: ${game.word}.`
            );
        }
    } else {
        gamePopup("Not in word list.");
        // empty all the game cell
        for (let i = 0; i < 5; i++) {
            remove();
        }
    }
};

/**
 * Switch hard mode on or off
 *
 * @param {Boolean} hardMode - Indicate that if hard mode is enabled or not
 */
const switchDifficulty = (hardMode) => {
    hardMode = typeof hardMode === "boolean" ? hardMode : !game.hardMode;

    if (hardMode) {
        hardModeSwitch.querySelector(".knob").classList.add("switch-active");
    } else {
        hardModeSwitch.querySelector(".knob").classList.remove("switch-active");
    }
    game.hardMode = hardModeSwitch.querySelector(".knob").dataset.hardmode =
        hardModeSwitch
            .querySelector(".knob")
            .classList.contains("switch-active");
    localStorage.setItem("wordle-hardMode", JSON.stringify(game.hardMode));
};

/**
 * Switch the current theme to dark or light
 *
 * @param {Boolean} darkMode - Indicate that dark mode is enabled or not
 */
const switchTheme = (darkMode) => {
    darkMode = typeof darkMode === "boolean" ? darkMode : !game.darkMode;

    if (darkMode) {
        document.querySelector("html").classList.remove("light");
        document.querySelector("html").classList.add("dark");
        darkModeSwitch.querySelector(".knob").classList.add("switch-active");
    } else {
        document.querySelector("html").classList.remove("dark");
        document.querySelector("html").classList.add("light");
        darkModeSwitch.querySelector(".knob").classList.remove("switch-active");
    }
    game.darkMode = darkModeSwitch.querySelector(".knob").dataset.darkmode =
        darkModeSwitch
            .querySelector(".knob")
            .classList.contains("switch-active");
    localStorage.setItem("wordle-darkMode", JSON.stringify(game.darkMode));
};

/**
 * Show the overlay section
 *
 * @param {HTMLElement} contentId - The corresponding content element on overlay
 */
const showOverlay = (contentId) => {
    if (!gameSection.classList.contains("game-section-disable")) {
        gameSection.classList.add("game-section-disable");
    }
    if (
        overlayCrossButton
            .closest("#overlay")
            .classList.contains("overlay-disable")
    ) {
        overlayCrossButton
            .closest("#overlay")
            .classList.remove("overlay-disable");
    }
    [...overlayCrossButton.closest("#overlay").children].forEach(
        (content, index) => {
            if (content === contentId) {
                content.style.display = "inherit";
            } else if (index !== 0) {
                content.style.display = "none";
            }
        }
    );
};

/**
 * Hide the overlay section
 *
 * @param {HTMLElement} contentId - The corresponding content element on overlay
 */
const hideOverlay = (contentId) => {
    if (gameSection.classList.contains("game-section-disable")) {
        gameSection.classList.remove("game-section-disable");
    }
    if (
        !overlayCrossButton
            .closest("#overlay")
            .classList.contains("overlay-disable")
    ) {
        overlayCrossButton.closest("#overlay").classList.add("overlay-disable");
    }
    [...overlayCrossButton.closest("#overlay").children].forEach(
        (content, index) => {
            if (index !== 0) {
                content.style.display = "none";
            }
        }
    );
};

// add listener for rules button
rulesButton.addEventListener(
    "click",
    showOverlay.bind(this, helpOverlayContent)
);

// add listener for overlay cross button
overlayCrossButton.addEventListener(
    "click",
    hideOverlay.bind(this, helpOverlayContent)
);

// add listener for settings button
settingsButton.addEventListener(
    "click",
    showOverlay.bind(this, settingsOverlayContent)
);

// add listener for overlay cross buttion
overlayCrossButton.addEventListener(
    "click",
    hideOverlay.bind(this, settingsOverlayContent)
);

// By default show the helpOverlay at the beginning
showOverlay(helpOverlayContent);

// set the theme & difficulty according to localstorage value
switchDifficulty(game.hardMode);
switchTheme(game.darkMode);

hardModeSwitch.addEventListener("click", switchDifficulty);
darkModeSwitch.addEventListener("click", switchTheme);

// Interact if user type any key from external keyboard
window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey && !e.altKey) {
        if (!game.isGameEnd && !game.win) {
            // if pressed key is a letter
            if (
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                (e.keyCode >= 97 && e.keyCode <= 122)
            ) {
                if (game.guesses[game.currentTry].length < 5) {
                    type(e.key.toString().toLowerCase());
                } else {
                    gamePopup("Please press enter to submit this word.");
                }
            } else if (e.keyCode === 8) {
                // if pressed key is Backspace
                if (game.guesses[game.currentTry].length >= 1) {
                    remove();
                } else {
                    gamePopup(
                        "Please guess a word within 5 characters & type it."
                    );
                }
            } else if (e.keyCode === 13) {
                // if pressed key is Enter
                if (game.guesses[game.currentTry].length === 5) {
                    submit(game.guesses[game.currentTry].join(""));
                } else {
                    gamePopup("Not enough letters.");
                }
            }
        } else if (game.isGameEnd && game.currentTry <= game.maxTries) {
            if (game.win) {
                gamePopup(
                    `You can guess the word within ${game.currentTry} tries. Refresh the page to play again.`
                );
            } else {
                gamePopup(
                    `You cannot guess the correct word. The word is: ${game.word}.`
                );
            }
        } else {
            gamePopup(
                "You exceed your maximum tries. Please refresh the page to play again."
            );
        }
    }
});

// Interact if the user type any key from the screen keyboard
document.querySelectorAll(".keyboard-row").forEach((row) => {
    row.querySelectorAll("button").forEach((key) => {
        key.addEventListener("click", (e) => {
            if (!e.ctrlKey && !e.altKey) {
                if (!game.isGameEnd && !game.win) {
                    // if pressed key is a letter
                    if (
                        (parseInt(e.target.dataset.keycode) >= 65 &&
                            parseInt(e.target.dataset.keycode) <= 90) ||
                        (parseInt(e.target.dataset.keycode) >= 97 &&
                            parseInt(e.target.dataset.keycode) <= 122)
                    ) {
                        if (game.guesses[game.currentTry].length < 5) {
                            type(e.target.dataset.key.toString().toLowerCase());
                        } else {
                            gamePopup(
                                "Please press enter to submit this word."
                            );
                        }
                    } else if (parseInt(e.target.dataset.keycode) === 8) {
                        // if pressed key is Backspace
                        if (game.guesses[game.currentTry].length >= 1) {
                            remove();
                        } else {
                            gamePopup(
                                "Please guess a word within 5 characters & type it."
                            );
                        }
                    } else if (parseInt(e.target.dataset.keycode) === 13) {
                        // if pressed key is Enter
                        if (game.guesses[game.currentTry].length === 5) {
                            submit(game.guesses[game.currentTry].join(""));
                        } else {
                            gamePopup("Not enough letters.");
                        }
                    }
                } else if (game.isGameEnd && game.currentTry <= game.maxTries) {
                    if (game.win) {
                        gamePopup(
                            `You can guess the word within ${game.currentTry} tries. Refresh the page to play again.`
                        );
                    } else {
                        gamePopup(
                            `You cannot guess the correct word. The word is: ${game.word}.`
                        );
                    }
                } else {
                    gamePopup(
                        "You exceed your maximum tries. Please refresh the page to play again."
                    );
                }
            }
        });
    });
});
