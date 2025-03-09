// emojiManager.js

export const defaultEmojis = [
  "🍓", "🍕", "🍔", "🌵", "🐱", "🐟", "🎸", "🎨", "📱", "🚗",
  "🍦", "🥑", "🦄", "🌙", "🔥", "🎶", "💻", "🐻", "🍩", "🏀",
  "🌈", "🍿", "🥂", "🍹", "🎁", "🏞️", "🚀", "🎧", "👑", "⚽"
];

export function loadEmojiList() {
  const storedEmojis = localStorage.getItem("emojiList");
  return storedEmojis ? JSON.parse(storedEmojis) : [...defaultEmojis];
}

export function saveEmojiList(emojiList) {
  localStorage.setItem("emojiList", JSON.stringify(emojiList));
}

export function populateEmojiTable(emojiList) {
  const tableBody = document.getElementById("emojiTable").querySelector("tbody");
  tableBody.innerHTML = "";

  emojiList.forEach((emoji, index) => {
    const row = document.createElement("tr");
    const emojiCell = document.createElement("td");
    emojiCell.textContent = emoji;
    row.appendChild(emojiCell);

    const actionCell = document.createElement("td");
    const resetButton = document.createElement("button");
    resetButton.textContent = "Réinitialiser";
    resetButton.onclick = () => {
      emojiList[index] = defaultEmojis[index];
      saveEmojiList(emojiList);
      populateEmojiTable(emojiList);
    };
    actionCell.appendChild(resetButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}
// Charger l'image du dos de carte au démarrage si elle est stockée
window.addEventListener("load", () => {
    if (localStorage.getItem("backCardImage")) {
        backCardImage = localStorage.getItem("backCardImage");
        document.getElementById("backCardPreview").src = backCardImage;
        document.getElementById("backCardPreview").style.display = "block";
    }
});


// Tableau emojis
document.addEventListener("DOMContentLoaded", () => {
  const emojiSizeSlider = document.getElementById("emojiSize");
  const emojiRotationSlider = document.getElementById("emojiRotation");

  if (emojiSizeSlider) {
    emojiSizeSlider.addEventListener("input", (event) => {
      const newSize = event.target.value;
      const emojiSizeValue = document.getElementById("emojiSizeValue");
      if (emojiSizeValue) emojiSizeValue.textContent = newSize;

      if (currentSelectedEmoji) {
        if (currentSelectedEmoji.querySelector('img')) {
          currentSelectedEmoji.style.width = `${newSize}px`;
          currentSelectedEmoji.style.height = `${newSize}px`;
        } else {
          currentSelectedEmoji.style.fontSize = `${newSize}px`;
        }
      }
    });
  }

  if (emojiRotationSlider) {
    emojiRotationSlider.addEventListener("input", (event) => {
      const newRotation = event.target.value;
      const emojiRotationValue = document.getElementById("emojiRotationValue");
      if (emojiRotationValue) emojiRotationValue.textContent = newRotation;

      if (currentSelectedEmoji) {
        currentSelectedEmoji.style.transform = `rotate(${newRotation}deg)`;
        currentSelectedEmoji.dataset.rotation = newRotation;
      }
    });
  }
});


// Fonction pour remplir le tableau des émojis personnalisables
function populateEmojiTable() {
    const tableBody = document.getElementById("emojiTable").querySelector("tbody");
    tableBody.innerHTML = "";

    emojiList.forEach((emoji, index) => {
        const row = document.createElement("tr");

        const numberCell = document.createElement("td");
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        const emojiCell = document.createElement("td");
        if (emoji.startsWith("data:image")) {
            emojiCell.innerHTML = `<img src="${emoji}" width="20" height="20">`;
        } else {
            emojiCell.textContent = emoji;
        }
        emojiCell.id = `current-emoji-${index}`;
        row.appendChild(emojiCell);

        const inputCell = document.createElement("td");
        const uploadButton = document.createElement("label");
        uploadButton.className = "bouton-style"; // Apply the button style
        uploadButton.textContent = "Choisir un fichier";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.dataset.index = index;
        fileInput.style.display = "none"; // Hide the input element

        uploadButton.appendChild(fileInput);
        inputCell.appendChild(uploadButton);

        uploadButton.addEventListener("click", (event) => {
    event.preventDefault(); // Évite un comportement inattendu
    fileInput.click();
}, { once: true }); // S'assure que l'événement ne se déclenche qu'une seule fois


  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            emojiList[index] = e.target.result;
            saveEmojiList();
            populateEmojiTable();  // Mise à jour immédiate de l'affichage
            generateCards();        // Re-générer les cartes pour inclure le nouvel emoji
        };
        reader.readAsDataURL(file);
    }
}, { once: true }); // Empêche la boîte de dialogue de s'ouvrir deux fois

        row.appendChild(inputCell);

        const actionCell = document.createElement("td");
        const resetButton = document.createElement("button");
        resetButton.textContent = "Réinitialiser";
        resetButton.onclick = () => resetEmoji(index);
        actionCell.appendChild(resetButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Fonction pour réinitialiser un émoji
function resetEmoji(index) {
  emojiList[index] = defaultEmojis[index];
  saveEmojiList();
  populateEmojiTable();
  generateCards();
}

// Plugin tout réinitialiser
document.getElementById("resetAll").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment réinitialiser tous les émojis ?")) {
        emojiList = [...defaultEmojis]; // Remet tous les émojis par défaut
        saveEmojiList();  // Sauvegarde la nouvelle liste dans localStorage
        populateEmojiTable();  // Met à jour le tableau
        generateCards();  // Re-génère les cartes Dobble
    }
});
