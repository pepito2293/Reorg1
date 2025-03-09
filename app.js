
// app.js - Gestion globale et événements
import { generateDobbleCards, displayCards } from './dobble.js';
import { downloadCardsAsPDF, exportCardsAsZip } from './exporter.js';

// Initialisation des émojis par défaut ou personnalisés
const defaultEmojis = [
    "🍓", "🍕", "🍔", "🌵", "🐱", "🐟", "🎸", "🎨", "📱", "🚗",
    "🍦", "🥑", "🦄", "🌙", "🔥", "🎶", "💻", "🐻", "🍩", "🏀",
    "🌈", "🍿", "🥂", "🍹", "🎁", "🏞️", "🚀", "🎧", "👑", "⚽"
];

let emojiList = loadEmojiList();

function loadEmojiList() {
    const storedEmojis = localStorage.getItem("emojiList");
    return storedEmojis ? JSON.parse(storedEmojis) : [...defaultEmojis];
}

function saveEmojiList() {
    localStorage.setItem("emojiList", JSON.stringify(emojiList));
}

// Gestion des boutons principaux
document.addEventListener("DOMContentLoaded", () => {
    displayCards(emojiList);

    document.getElementById("generateCardsBtn").addEventListener("click", () => {
        displayCards(emojiList);
    });

    document.getElementById("downloadPDFBtn").addEventListener("click", () => {
        downloadCardsAsPDF();
    });

    document.getElementById("downloadZIPBtn").addEventListener("click", () => {
        exportCardsAsZip();
    });

    // Gestion des curseurs de taille et de rotation
    const emojiSizeSlider = document.getElementById("emojiSize");
    emojiSizeSlider.addEventListener("input", (event) => {
        const newSize = event.target.value;
        document.getElementById("emojiSizeValue").textContent = newSize;

        if (currentSelectedEmoji) {
            if (currentSelectedEmoji.querySelector('img')) {
                currentSelectedEmoji.style.width = `${newSize}px`;
                currentSelectedEmoji.style.height = `${newSize}px`;
            } else {
                currentSelectedEmoji.style.fontSize = `${newSize}px`;
            }
        }
    });

    const emojiRotationSlider = document.getElementById("emojiRotation");
    emojiRotationSlider.addEventListener("input", (event) => {
        const newRotation = event.target.value;
        const emojiRotationValue = document.getElementById("emojiRotationValue");
        emojiRotationValue.textContent = newRotation;

        if (currentSelectedEmoji) {
            currentSelectedEmoji.style.transform = `rotate(${newRotation}deg)`;
            currentSelectedEmoji.dataset.rotation = newRotation;
        }
    });

    // Gestion de l'upload du dos de carte
    const backCardUpload = document.getElementById("backCardUpload");
    backCardUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const backCardImage = e.target.result;
                localStorage.setItem("backCardImage", backCardImage);
                const backCardPreview = document.getElementById("backCardPreview");
                backCardPreview.src = backCardImage;
                backCardPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
});
