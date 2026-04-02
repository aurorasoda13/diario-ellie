const Animations = {

  /* ————————————————
     Effetti estetici
  ———————————————— */

  leafSwing(el) {
    el.animate([
      { transform: "rotate(-3deg)" },
      { transform: "rotate(3deg)" }
    ], {
      duration: 3000,
      iterations: Infinity,
      direction: "alternate"
    });
  },

  mapZoom(el) {
    el.addEventListener("click", () => {
      el.animate([
        { transform: "scale(1)" },
        { transform: "scale(1.2)" }
      ], { duration: 400, fill: "forwards" });
    });
  },

  mothGlow(el) {
    el.animate([
      { opacity: 0.7 },
      { opacity: 1 }
    ], {
      duration: 2000,
      iterations: Infinity,
      direction: "alternate"
    });
  },

  /* ————————————————
     Effetti narrativi
  ———————————————— */

  noteReveal(el) {
    el.addEventListener("click", () => {
      showMessage("Forse anche io sono un po’ così.");
    });
  },

  boxOpen(el) {
    el.addEventListener("click", () => {
      showMessage("Non smettere di cercare cose belle.");
    });
  },

  /* ————————————————
     Sblocco segreto C (tavolo → chiave)
  ———————————————— */

unlockKey(el) {
  el.addEventListener("click", () => {
    showMessage("Sotto una tavola allentata… qualcosa brilla.");
    unlockedPages.add("table");     // <— AGGIUNGI QUESTO
    unlockedPages.add("secretC");   // <— GIUSTO
    showSecretIcon();
  });
},

  /* ————————————————
     Sblocco segreto D tramite rebus Morse
     (chiave → rebus → stanza)
  ———————————————— */

  startRiddle(el) {
    el.addEventListener("click", () => {
      showRiddle(
        "-.-.   ....   ..   .-   ...-   .\n\n" +
        "Ogni gruppo è una lettera.\n" +
        "Decifra il codice. Qual è la parola?",
        "chiave"
      );
    });
  }
};
