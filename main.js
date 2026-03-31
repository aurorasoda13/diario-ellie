let currentPage = 0;
let pages = [];
let audioUnlocked = false;
let currentAudio = null;

/* ————————————————
   SBLOCCO AUDIO
——————————————— */
document.addEventListener("click", () => {
  audioUnlocked = true;
});

/* ————————————————
   CARICAMENTO PAGINE
——————————————— */
async function loadPages() {
  const pageFiles = [
    "page1.json", "page2.json", "page3.json",
    "page4.json", "secretA.json", "secretB.json", 
     "page5.json", "page6.json",
    "page7.json", "page8.json", "page9.json", 
   "last.json",
  ];

  for (let file of pageFiles) {
    const data = await fetch(`pages/${file}`).then(r => r.json());
    pages.push(data);
  }

  showStartScreen();
}

/* ————————————————
   PAGINA INIZIALE
——————————————— */
function showStartScreen() {
  document.getElementById("startScreen").classList.add("visible");
}

document.getElementById("startButton").onclick = () => {
  document.getElementById("startScreen").classList.remove("visible");

  // Messaggio narrativo
  showMessage("Alza il volume per goderti l’esperienza al meglio.");

  // Dopo il messaggio → mostra pagina 1
  setTimeout(() => {
    showPage(0);
  }, 600);
};

/* ————————————————
   PAGINA FINALE
——————————————— */
function showEndScreen() {
  document.getElementById("endScreen").classList.add("visible");
}

document.getElementById("restartButton").onclick = () => {
   if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  document.getElementById("endScreen").classList.remove("visible");
  showStartScreen();
};

/* ————————————————
   MOSTRA PAGINA
——————————————— */
function showPage(index) {
  if (index >= pages.length) {
    showEndScreen();
    return;
  }

  const container = document.getElementById("pageContainer");
  const page = pages[index];
  const sizeClass = page.imageSize ? `img-${page.imageSize}` : "";

  container.innerHTML = `
    <div class="page visible">
      <h2>${page.title}</h2>
      <img src="assets/images/${page.image}" class="sketch ${sizeClass}" id="sketch">
      <p class="text">${page.text}</p>
    </div>
  `;

  const sketch = document.getElementById("sketch");

  /* — Animazioni — */
  page.effects.forEach(effect => {
    if (Animations[effect]) Animations[effect](sketch);
  });

  /* — AUDIO — */
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  if (page.audio && audioUnlocked) {
    currentAudio = new Audio(`assets/audio/${page.audio}`);
    currentAudio.volume = 0.6;
    currentAudio.play().catch(err => console.log("Audio bloccato:", err));
  }
}

/* ————————————————
   MESSAGGIO CENTRALE
——————————————— */
function showMessage(text) {
  const overlay = document.getElementById("messageOverlay");
  const msg = document.getElementById("messageText");

  msg.textContent = text;
  overlay.classList.add("visible");

  overlay.onclick = () => {
    overlay.classList.remove("visible");
  };
}

/* ————————————————
   CONTROLLI PAGINE
——————————————— */
document.getElementById("nextPage").onclick = () => {
  currentPage++;
  showPage(currentPage);
};

document.getElementById("prevPage").onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
};

loadPages();
