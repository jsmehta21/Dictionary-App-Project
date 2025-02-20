const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");

// Function to fetch word data
function fetchWord() {
    let word = inpWord.value.trim();

    if (!word) {
        result.innerHTML = `<h3 class="error">Please Enter a Word</h3>`;
        return;
    }

    // Show loading spinner
    result.innerHTML = `<div class="spinner"></div>`;

    fetch(`${url}${word}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            if (!data || data.title) {
                throw new Error("Word not found");
            }

            const wordData = data[0];
            const phonetic = wordData.phonetic || "No phonetic available";
            const partOfSpeech = wordData.meanings?.[0]?.partOfSpeech || "N/A";
            const definition = wordData.meanings?.[0]?.definitions?.[0]?.definition || "No definition found.";
            const example = wordData.meanings?.[0]?.definitions?.[0]?.example || "No example available.";
            const audioSrc = wordData.phonetics?.find(p => p.audio)?.audio || null;

            result.innerHTML = `
                <div class="word">
                    <h3>${wordData.word}</h3>
                    <button ${audioSrc ? `onClick="playSound()"` : "disabled"} >
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${partOfSpeech}</p>
                    <p>/${phonetic}/</p>
                </div>
                <p class="word-meaning">${definition}</p>
                <p class="word-example">${example}</p>`;

            if (audioSrc) {
                sound.setAttribute("src", audioSrc);
            }
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't find the word</h3>`;
        });
}

// Play pronunciation sound
function playSound() {
    sound.play();
}

// Add event listener for button click
btn.addEventListener("click", fetchWord);

// Add "Enter" key support
inpWord.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchWord();
    }
});
