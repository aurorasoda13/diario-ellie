let currentPage = 0;
let pages = [];
let audioUnlocked = false;
let currentAudio = null;
let unlockedPages = new Set();

const savedUnlocks = localStorage.getItem("unlockedPages");
if (savedUnlocks) {
  unlockedPages = new Set(JSON.parse(savedUnlocks));
}


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
    "table.json",
    "secretC.json",
    "secretD.json",
    "page16.json",
    "page17.json",
    "page18.json",
    "page19.json",
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

  const saved = localStorage.getItem("lastPage");

  if (saved !== null) {
    document.getElementById("resumeScreen").classList.add("visible");
  } else {
    currentPage = 0;
    showPage(0);
  }
};

/* ————————————————
   SCELTA: RIPRENDI / RICOMINCIA
——————————————— */
document.getElementById("resumeBtn").onclick = () => {
  const saved = parseInt(localStorage.getItem("lastPage"));
 
  document.getElementById("resumeScreen").classList.remove("visible");
  currentPage = saved;
  showPage(saved);
};

document.getElementById("restartBtn").onclick = () => {
  localStorage.removeItem("lastPage");
  document.getElementById("resumeScreen").classList.remove("visible");
  currentPage = 0;
  showPage(0);
  localStorage.removeItem("unlockedPages");
  unlockedPages = new Set();

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

document.getElementById("endPrev").onclick = () => {
  const end = document.getElementById("endScreen");
  end.classList.remove("visible");

  currentPage = pages.length - 2; // ultima pagina vera
  showPage(currentPage);
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
  if (page.effects && Array.isArray(page.effects)) {
    page.effects.forEach(effect => {
      if (Animations[effect]) Animations[effect](sketch);
    });
  }

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

  // SALVA L’ULTIMA PAGINA VISITATA
  localStorage.setItem("lastPage", index);
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
function showRiddle(question, answer, unlockId = null) {
  const overlay = document.getElementById("riddleOverlay");
  const text = document.getElementById("riddleText");
  const input = document.getElementById("riddleInput");
  const submit = document.getElementById("riddleSubmit");
  const closeBtn = document.getElementById("riddleClose");

  if (closeBtn) {
    closeBtn.onclick = () => {
      overlay.classList.remove("visible");
    };
  }

  text.textContent = question;
  input.value = "";
  overlay.classList.add("visible");

  submit.onclick = () => {
    if (input.value.trim().toLowerCase() === answer.toLowerCase()) {
      overlay.classList.remove("visible");

      if (unlockId) {
        unlockedPages.add(unlockId);
        localStorage.setItem("unlockedPages", JSON.stringify([...unlockedPages]));
        showSecretIcon();
      }

      showMessage("Codice risolto.");
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
  localStorage.setItem("lastPage", currentPage);
  showPage(currentPage);
};

document.getElementById("prevPage").onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    localStorage.setItem("lastPage", currentPage);
    showPage(currentPage);
  }



};

loadPages();
