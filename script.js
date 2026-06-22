const display = document.getElementById("display");

//  lagu
const easterEggSongs = {
    "505": {
        title: "Arctic Monkeys - 505",
        audioUrl: "audio/505.mp3"
    },
    "2112": {
        title: "Angka Judul Lagu Lain",
        audioUrl: "audio/2112.mp3",
        startTime: 181
    }
};

let currentAudio = null;
let marqueeInterval = null; 

function toggleSign() {
    stopMarquee();
    if (display.value !== "" && display.value !== "error") {
        if (display.value.startsWith("-")) {
            display.value = display.value.slice(1);
        } else {
            display.value = "-" + display.value;
        }
    }
}

function calculate() {
    let expression = display.value;

    if (easterEggSongs[expression]) {
        playEasterEgg(expression);
        return; 
    }

    try {
        expression = expression.replace(/%/g, "/100");
        let result = eval(expression);
        
        if (result === undefined || Number.isNaN(result) || !isFinite(result)) {
            throw new Error("Invalid output");
        }
        display.value = result;
    } catch (error) {
        display.value = "error";
    }
}

function playEasterEgg(songCode) {
    let song = easterEggSongs[songCode];

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(song.audioUrl);
    
    currentAudio.addEventListener("loadedmetadata", () => {
        currentAudio.currentTime = song.startTime || 0;
        
        currentAudio.play().catch(error => {
            console.log("Audio gagal diputar. Error:", error);
            stopMarquee();
            display.value = "AUDIO ERROR"; 
        });
    });

    let textToAnimate = "PLAYING: " + song.title.toUpperCase() + "        ";
    startMarquee(textToAnimate);
}

// FUNGSI ANIMASI TEKS BERJALAN
function startMarquee(text) {
    clearInterval(marqueeInterval);
    
    let currentText = text;
    display.value = currentText;
    
    marqueeInterval = setInterval(() => {
        currentText = currentText.substring(1) + currentText[0];
        display.value = currentText;
    }, 250);
}

// FUNGSI MENGHENTIKAN ANIMASI
function stopMarquee() {
    if (marqueeInterval !== null) {
        clearInterval(marqueeInterval);
        marqueeInterval = null;
    }
}

function clearDisplay() {
    stopMarquee(); 
    display.value = "";
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function appendToDisplay(input) {
    if (display.value === "error" || marqueeInterval !== null) {
        stopMarquee();
        display.value = "";
    }
    display.value += input;
}

function deleteLast() {
    if (display.value === "error" || marqueeInterval !== null) {
        stopMarquee();
        display.value = "";
    } else {
        display.value = display.value.toString().slice(0, -1);
    }
}