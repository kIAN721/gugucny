/* ==========================================================================
   1. Telegram Notification Configuration
   ========================================================================== */
const TELEGRAM_CONFIG = {
  botToken: "8832112215:AAGga3nuyOUKmOcTPjLs1FcU8zS9Rf7QCrc",
  chatId: "1694644020",
  enabled: true
};

async function sendTelegramAlert(message) {
  if (!TELEGRAM_CONFIG.enabled || !TELEGRAM_CONFIG.botToken) return;

  const endpoint = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: message,
        parse_mode: "HTML"
      })
    });
  } catch (error) {
    console.warn("Telegram notification skipped:", error);
  }
}

/* ==========================================================================
   2. Sparkle Burst Helper & Ambient Petals
   ========================================================================== */
function triggerSparkleBurst(x, y, count = 14) {
  const layer = document.getElementById("sparkleLayer");
  if (!layer) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "burst-star";

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = 45 + Math.random() * 75;
    const tx = `${Math.cos(angle) * distance}px`;
    const ty = `${Math.sin(angle) * distance - 20}px`;

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.setProperty("--tx", tx);
    star.style.setProperty("--ty", ty);

    layer.appendChild(star);
    setTimeout(() => star.remove(), 900);
  }
}

function initPetals() {
  const container = document.getElementById("petalContainer");
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const size = 9 + Math.random() * 7;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animationDuration = `${7 + Math.random() * 6}s`;
    petal.style.animationDelay = `${Math.random() * -12}s`;

    container.appendChild(petal);
  }
}

/* ==========================================================================
   3. Interactive Running Goat Boost
   ========================================================================== */
function initRunningGoat() {
  const goatRunner = document.getElementById("goatRunner");
  const goatSpeech = document.getElementById("goatSpeech");
  if (!goatRunner) return;

  const quips = [
    "baa-lessed 2027 ✨",
    "goat era unlocked 🐐",
    "2003 goat energy 💫",
    "manifesting luck 🧧",
    "no bad vibes allowed 🌸"
  ];
  let tapCount = 0;

  const hopGoat = (e) => {
    e.stopPropagation();
    const rect = goatRunner.getBoundingClientRect();
    triggerSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

    goatSpeech.textContent = quips[tapCount % quips.length];
    goatRunner.classList.remove("is-hopping");
    void goatRunner.offsetWidth; // Restart hop animation
    goatRunner.classList.add("is-hopping");

    tapCount += 1;
    if (tapCount === 1 || tapCount % 3 === 0) {
      sendTelegramAlert(`🐐💫 <b>gugucny:</b> She tapped the running goat (${tapCount}x)!`);
    }
  };

  goatRunner.addEventListener("click", hopGoat);
}

/* ==========================================================================
   4. Stage 1 & 2 Controller (Envelope + Replayable 3D Keepsake Deck)
   ========================================================================== */
function initStages() {
  const envelopeStage = document.getElementById("envelopeStage");
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const envelope3d = document.getElementById("envelope3d");
  const deckStage = document.getElementById("deckStage");
  const replayEnvelopeBtn = document.getElementById("replayEnvelopeBtn");

  const cards = Array.from(document.querySelectorAll(".deck-card"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const prevBtn = document.getElementById("prevCardBtn");
  const nextBtn = document.getElementById("nextCardBtn");
  const deckViewport = document.getElementById("deckViewport");

  const birthYearCard = document.getElementById("birthYearCard");
  const flipBtn = document.getElementById("flipBirthCardBtn");
  const unflipBtn = document.getElementById("unflipBirthCardBtn");

  const charmChips = Array.from(document.querySelectorAll(".charm-chip"));
  const charmReadout = document.getElementById("charmReadout");

  let isOpened = false;
  let openAlertSent = false;
  let currentIndex = 0;
  let flippedAlertSent = false;
  let finalCardAlertSent = false;

  // --- Envelope 3D Pointer Tilt (Desktop Mouse Only) ---
  envelopeWrapper.addEventListener("pointermove", (e) => {
    if (isOpened || e.pointerType !== "mouse") return;
    const rect = envelopeWrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    envelope3d.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
  });

  envelopeWrapper.addEventListener("pointerleave", () => {
    if (isOpened) return;
    envelope3d.style.transform = "";
  });

  // --- Open Envelope Sequence ---
  const handleOpenEnvelope = () => {
    if (isOpened) return;
    isOpened = true;

    const rect = envelopeWrapper.getBoundingClientRect();
    triggerSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.4, 22);

    envelope3d.style.transform = "";
    envelope3d.classList.add("is-open");

    if (!openAlertSent) {
      openAlertSent = true;
      sendTelegramAlert("🐐🧧 <b>gugucny:</b> She opened the 2027 Year of the Goat envelope!");
    }

    setTimeout(() => {
      envelopeStage.classList.add("is-hidden");
      deckStage.classList.add("is-visible");
      deckStage.setAttribute("aria-hidden", "false");
    }, 850);
  };

  // --- Reset Back to Envelope (Allows Re-opening Anytime) ---
  const handleReplayEnvelope = () => {
    deckStage.classList.remove("is-visible");
    deckStage.setAttribute("aria-hidden", "true");
    birthYearCard.classList.remove("is-flipped");
    updateDeck(0);

    setTimeout(() => {
      envelope3d.classList.remove("is-open");
      envelopeStage.classList.remove("is-hidden");
      isOpened = false;
    }, 300);
  };

  envelopeWrapper.addEventListener("click", handleOpenEnvelope);
  envelopeWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenEnvelope();
    }
  });
  replayEnvelopeBtn.addEventListener("click", handleReplayEnvelope);

  // --- Deck State Updater ---
  function updateDeck(newIndex) {
    if (newIndex < 0 || newIndex >= cards.length) return;
    currentIndex = newIndex;

    cards.forEach((card, idx) => {
      card.style.transform = "";
      card.classList.remove("is-active", "is-next", "is-prev");
      if (idx === currentIndex) {
        card.classList.add("is-active");
      } else if (idx > currentIndex) {
        card.classList.add("is-next");
      } else {
        card.classList.add("is-prev");
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;

    if (currentIndex === cards.length - 1 && !finalCardAlertSent) {
      finalCardAlertSent = true;
      sendTelegramAlert("💌✨ <b>gugucny:</b> She reached the final 2027 CNY blessing card!");
    }
  }

  // --- 3D Birth-Year Flip ---
  flipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    birthYearCard.classList.add("is-flipped");
    if (!flippedAlertSent) {
      flippedAlertSent = true;
      sendTelegramAlert("✨🐐 <b>gugucny:</b> She flipped the Year of the Goat birth-year card!");
    }
  });

  unflipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    birthYearCard.classList.remove("is-flipped");
  });

  // --- Interactive Goat Charm Picker (Card 2) ---
  charmChips.forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      charmChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      charmReadout.textContent = chip.dataset.note;

      const rect = chip.getBoundingClientRect();
      triggerSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
      sendTelegramAlert(`🧧✨ <b>gugucny:</b> She picked the charm: <b>${chip.dataset.charm}</b>`);
    });
  });

  // --- Button & Dot Navigation ---
  prevBtn.addEventListener("click", () => updateDeck(currentIndex - 1));
  nextBtn.addEventListener("click", () => updateDeck(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => updateDeck(Number(dot.dataset.slide)));
  });

  // --- Real-Time Touch Drag & Swipe Physics ---
  let startX = 0;
  let currentDeltaX = 0;
  let isDragging = false;

  deckViewport.addEventListener("touchstart", (e) => {
    if (e.target.closest("button")) return;
    startX = e.touches[0].clientX;
    currentDeltaX = 0;
    isDragging = true;
    cards[currentIndex].style.transition = "none";
  }, { passive: true });

  deckViewport.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentDeltaX = e.touches[0].clientX - startX;
    const rotateY = currentDeltaX * 0.06;
    cards[currentIndex].style.transform = `translate3d(${currentDeltaX * 0.55}px, 0, 0) rotateY(${rotateY}deg)`;
  }, { passive: true });

  deckViewport.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    cards[currentIndex].style.transition = "";

    if (currentDeltaX < -50 && currentIndex < cards.length - 1) {
      updateDeck(currentIndex + 1);
    } else if (currentDeltaX > 50 && currentIndex > 0) {
      updateDeck(currentIndex - 1);
    } else {
      cards[currentIndex].style.transform = "";
    }
  });
}

/* ==========================================================================
   5. Initialize App
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initPetals();
  initRunningGoat();
  initStages();
});