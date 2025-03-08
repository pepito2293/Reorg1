// uiController.js
import { generateDobbleCards, displayCards } from './dobbleGenerator.js';
import { loadEmojiList, populateEmojiTable } from './emojiManager.js';
import { downloadCardsAsPDF } from './exportManager.js';

export function initializeUI() {
  const emojiList = loadEmojiList();
  populateEmojiTable(emojiList);

  const generateCardsBtn = document.getElementById("generateCardsBtn");
  const downloadPDFBtn = document.getElementById("downloadPDFBtn");

  if (generateCardsBtn) {
    generateCardsBtn.addEventListener("click", () => {
      const cards = generateDobbleCards(emojiList);
      displayCards(cards);
    });
  }

  if (downloadPDFBtn) {
    downloadPDFBtn.addEventListener("click", () => {
      const cards = document.querySelectorAll(".card");
      downloadCardsAsPDF(cards, localStorage.getItem("backCardImage"));
    });
  }
}
