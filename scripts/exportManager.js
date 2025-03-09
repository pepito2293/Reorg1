// exportManager.js
import html2canvas from "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
import JSZip from "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";

//Fonction export en PDF
// Fonction pour télécharger les cartes en PDF
async function downloadCardsAsPDF() {
    try {
        console.log("📥 Début de la génération du PDF...");

        // 🔄 Recharger l'image du dos des cartes si elle existe dans localStorage
        backCardImage = localStorage.getItem("backCardImage") || null;
        console.log("🔄 backCardImage rechargé :", backCardImage);

        // Vérification de la présence des cartes
        const cardContainer = document.getElementById("cardContainer");
        const cards = cardContainer.querySelectorAll(".card");

        if (cards.length === 0) {
            alert("Aucune carte à télécharger. Veuillez d'abord générer les cartes.");
            return;
        }

        // Vérification de la présence du dos des cartes
        if (!backCardImage) {
            alert("Veuillez ajouter une image pour le dos des cartes.");
            return;
        }

        console.log("✅ Toutes les vérifications sont OK !");

        // 📄 Initialisation du PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("portrait", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // 📏 Configuration des cartes sur le PDF
        const cardSize = 85.53; // Taille standard pour aligner les cartes
        const spaceBetween = 5;
        const maxCardsPerRow = 2;
        const maxCardsPerCol = 3;
        const totalCardsPerPage = maxCardsPerRow * maxCardsPerCol;

        const totalWidth = maxCardsPerRow * cardSize + (maxCardsPerRow - 1) * spaceBetween;
        const totalHeight = maxCardsPerCol * cardSize + (maxCardsPerCol - 1) * spaceBetween;

        const startX = (pageWidth - totalWidth) / 2;
        const startY = (pageHeight - totalHeight) / 2;

        let currentCardIndex = 0;
        let pages = [];

        // 📸 Capture des cartes recto
        console.log("📸 Capture des cartes...");
        for (let i = 0; i < cards.length; i++) {
            console.log(`📷 Capture de la carte ${i + 1}...`);
            const canvas = await html2canvas(cards[i], { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const row = Math.floor(currentCardIndex / maxCardsPerRow) % maxCardsPerCol;
            const col = currentCardIndex % maxCardsPerRow;
            const x = startX + col * (cardSize + spaceBetween);
            const y = startY + row * (cardSize + spaceBetween);

            if (!pages[Math.floor(currentCardIndex / totalCardsPerPage)]) {
                pages[Math.floor(currentCardIndex / totalCardsPerPage)] = [];
            }

            pages[Math.floor(currentCardIndex / totalCardsPerPage)].push({ imgData, x, y });

            currentCardIndex++;
        }

        console.log("✅ Toutes les cartes ont été capturées !");

        // 📄 Génération des pages du PDF avec recto-verso aligné
        pages.forEach((page, pageIndex) => {
            console.log(`🖨️ Ajout de la page ${pageIndex + 1} (recto)...`);
            if (pageIndex > 0) pdf.addPage();
            
            // Ajout des cartes (recto)
            page.forEach(({ imgData, x, y }) => {
                pdf.addImage(imgData, "PNG", x, y, cardSize, cardSize);
            });

            // Ajout du verso sur une nouvelle page
            console.log(`🔄 Ajout du verso des cartes sur la page ${pageIndex + 2}...`);
            pdf.addPage();
            page.forEach(({ x, y }) => {
                pdf.addImage(backCardImage, "PNG", x, y, cardSize, cardSize);
            });
        });

        // 📥 Téléchargement du PDF
        pdf.save("dobble_cards.pdf");
        alert("✅ Le PDF avec recto-verso a été généré avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors du téléchargement du PDF :", error);
        alert("Une erreur est survenue lors du téléchargement du PDF.");
    }
}





// Fonction export ZIP
async function exportCardsAsZip() {
  const cardContainer = document.getElementById("cardContainer");
  const cards = cardContainer.querySelectorAll(".card");

  if (cards.length === 0) {
    alert("Aucune carte à exporter. Veuillez d'abord générer les cartes.");
    return;
  }

  const zip = new JSZip(); // Initialisation du fichier ZIP
  const folder = zip.folder("Cartes_Dobble"); // Création d'un dossier dans le ZIP

  for (let i = 0; i < cards.length; i++) {
    const canvas = await html2canvas(cards[i], { scale: 2 }); // Capture la carte en tant que canvas
    const imgData = canvas.toDataURL("image/png"); // Convertit en PNG

    // Ajoute l'image au dossier ZIP
    folder.file(`carte_dobble_${i + 1}.png`, imgData.split(",")[1], { base64: true });
  }

  // Génère le fichier ZIP
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "cartes_dobble.zip"); // Télécharge le fichier ZIP
    alert("Les 55 cartes ont été téléchargées en tant que fichier ZIP !");
  });
}
