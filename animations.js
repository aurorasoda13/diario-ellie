const Animations = {
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


  mothGlow(el) {
    el.animate([
      { opacity: 0.7 },
      { opacity: 1 }
    ], {
      duration: 2000,
      iterations: Infinity,
      direction: "alternate"
    });
  }
};