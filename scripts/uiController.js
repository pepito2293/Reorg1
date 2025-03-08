// uiController.js
import { generateDobbleCards } from './dobbleGenerator.js';
import { loadEmojiList, populateEmojiTable } from './emojiManager.js';
import { downloadCardsAsPDF, exportCardsAsZip } from './exportManager.js';

export function initializeUI() {
    const emojiList = loadEmojiList();
    populateEmojiTable(emojiList);

    document.getElementById("generateCardsBtn").addEventListener("click", () => {
        const cards = generateDobbleCards(emojiList);
        displayCards(cards);
    });

    document.getElementById("downloadPDFBtn").addEventListener("click", () => {
        const cards = document.querySelectorAll(".card");
        downloadCardsAsPDF(cards, localStorage.getItem("backCardImage"));
    });

    document.getElementById("downloadZIPBtn").addEventListener("click", () => {
        const cards = document.querySelectorAll(".card");
        exportCardsAsZip(cards);
    });

    document.getElementById("backCardUpload").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                localStorage.setItem("backCardImage", e.target.result);
                document.getElementById("backCardPreview").src = e.target.result;
                document.getElementById("backCardPreview").style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
}

function displayCards(cards) {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";

    cards.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.addEventListener("mousedown", enableDrag);
        cardContainer.appendChild(cardDiv);
    });
}

function enableDrag(event) {
    const symbol = event.target;
    let offsetX = event.clientX - symbol.offsetLeft;
    let offsetY = event.clientY - symbol.offsetTop;

    function moveSymbol(e) {
        symbol.style.left = `${e.clientX - offsetX}px`;
        symbol.style.top = `${e.clientY - offsetY}px`;
    }

    function stopDrag() {
        document.removeEventListener("mousemove", moveSymbol);
        document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", moveSymbol);
    document.addEventListener("mouseup", stopDrag);
}
