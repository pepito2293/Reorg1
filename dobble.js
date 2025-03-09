
// dobble.js - Génération et affichage des cartes Dobble

export function generateDobbleCards(emojiList) {
    const n = 7; 
    const totalSymbols = n * n + n + 1;
    const symbols = emojiList.slice(0, totalSymbols);
    const cards = [];

    for (let i = 0; i <= n; i++) {
        const card = [symbols[0]];
        for (let j = 0; j < n; j++) {
            card.push(symbols[1 + i * n + j]);
        }
        cards.push(card);
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const card = [symbols[1 + i]];
            for (let k = 0; k < n; k++) {
                const index = 1 + n + k * n + ((i * k + j) % n);
                card.push(symbols[index]);
            }
            cards.push(card);
        }
    }

    return cards.slice(0, 55);
}

export function displayCards(emojiList) {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";

    const cards = generateDobbleCards(emojiList);
    cards.forEach((card) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        positionSymbols(cardDiv, card);
        cardContainer.appendChild(cardDiv);
    });
}

function positionSymbols(cardDiv, card) {
    const cardSize = 250;
    const margin = 20;
    const minSize = 30;
    const maxSize = 70;

    const positions = [];

    card.forEach((symbol) => {
        let isValidPosition = false;
        let x, y, size;

        while (!isValidPosition) {
            size = Math.random() * (maxSize - minSize) + minSize;
            x = margin + Math.random() * (cardSize - 2 * margin - size);
            y = margin + Math.random() * (cardSize - 2 * margin - size);

            isValidPosition = positions.every(pos => {
                const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
                return distance > (pos.size + size) / 2 + 10;
            });

            if (positions.length === 0) isValidPosition = true;
        }

        positions.push({ x, y, size });

        const symbolDiv = document.createElement("div");
        symbolDiv.className = "symbol";
        symbolDiv.textContent = symbol;
        symbolDiv.style.fontSize = `${size}px`;
        symbolDiv.style.left = `${x}px`;
        symbolDiv.style.top = `${y}px`;
        cardDiv.appendChild(symbolDiv);
    });
}
