let currentPage = 0;
let pages = [];
let audioUnlocked = false;
let currentAudio = null;
let unlockedPages = new Set();

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
    "table.json",      // nuova pagina
    "secretC.json",    // chiave
    "secretD.json",    // stanza
    "last.json"
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

  showMessage("Alza il volume per goderti l’esperienza al meglio.");

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

  const page = pages[index];

  // BLOCCO PAGINE NON SBLOCCATE
  if (page.unlock && !unlockedPages.has(page.unlock)) {
    showMessage("Questa pagina è ancora chiusa.");
    return;
  }

  const container = document.getElementById("pageContainer");
  const sizeClass = page.imageSize ? `img-${page.imageSize}` : "";

  container.innerHTML = `
    <div class="page visible">
      <h2>${page.title}</h2>
      <img src="assets/images/${page.image}" class="sketch ${sizeClass}" id="sketch">
      <p class="text">${page.text}</p>
    </div>
  `;

  const sketch = document.getElementById("sketch");

  // EFFETTI
  page.effects.forEach(effect => {
    if (Animations[effect]) Animations[effect](sketch);
  });

  // AUDIO
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  if (page.audio && audioUnlocked) {
    currentAudio = new Audio(`assets/audio/${page.audio}`);
    currentAudio.volume = 0.6;
    currentAudio.play().catch(() => {});
  }
}

/* ————————————————
   OVERLAY MESSAGGI
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
   ICONA SEGRETA
——————————————— */
function showSecretIcon() {
  const icon = document.getElementById("secretIcon");
  icon.classList.add("visible");

  setTimeout(() => {
    icon.classList.remove("visible");
  }, 2000);
}

/* ————————————————
   OVERLAY REBUS
——————————————— */
function showRiddle(question, answer) {
  const overlay = document.getElementById("riddleOverlay");
  const text = document.getElementById("riddleText");
  const input = document.getElementById("riddleInput");
  const submit = document.getElementById("riddleSubmit");

  text.textContent = question;
  input.value = "";
  overlay.classList.add("visible");

  submit.onclick = () => {
    if (input.value.trim().toLowerCase() === answer.toLowerCase()) {
      overlay.classList.remove("visible");

      unlockedPages.add("secretD");
      showSecretIcon();
      showMessage("Il codice è stato decifrato. La chiave rivela la stanza.");
  } else {
  text.textContent = question + "\n\n❌ Risposta errata. Riprova.";
}
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
