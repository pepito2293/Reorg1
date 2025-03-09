
// exporter.js - Gestion des téléchargements et exportations

import html2canvas from "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";

export async function downloadCardsAsPDF() {
    const cards = document.querySelectorAll(".card");
    const pdf = new jsPDF("portrait", "mm", "a4");

    cards.forEach(async (card, index) => {
        const canvas = await html2canvas(card, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10, 85, 85);
        if (index % 6 === 5) pdf.addPage();
    });

    pdf.save("dobble_cards.pdf");
}

export async function exportCardsAsZip() {
    const zip = new JSZip();
    const folder = zip.folder("Cartes_Dobble");

    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        folder.file(`carte_dobble_${i + 1}.png`, imgData.split(",")[1], { base64: true });
    }

    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "cartes_dobble.zip");
        alert("Les cartes ont été téléchargées en tant que fichier ZIP !");
    });
}
