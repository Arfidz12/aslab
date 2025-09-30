// === script.js ===
// Jam real-time
export function initClock() {
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("time").textContent = `${h}:${m}:${s}`;
  }

  // langsung tampilkan
  updateTime();
  // update tiap detik
  setInterval(updateTime, 1000);
}

// Navigasi Buku Tamu <-> Aslab
export function initNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const cards = document.querySelectorAll(".main .card");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.getAttribute("data-target");

      cards.forEach(card => {
        if (target === "guestbook") {
          // tampilkan form warga + history
          if (card.id === "guestbook" || card.classList.contains("history-card")) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        } else if (target === "aslab") {
          // tampilkan form aslab + shift
          if (card.id === "aslab" || card.classList.contains("shift-card")) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });
}

// Toggle input jadwal khusus
document.addEventListener("DOMContentLoaded", () => {
  const shiftSelect = document.getElementById("shiftSelect");
  const customShiftGroup = document.getElementById("customShiftGroup");

  if (shiftSelect) {
    shiftSelect.addEventListener("change", () => {
      if (shiftSelect.value === "khusus") {
        customShiftGroup.style.display = "block";
      } else {
        customShiftGroup.style.display = "none";
      }
    });
  }
});


export function initApp() {
  initClock();
  initNavigation();
}

document.addEventListener("DOMContentLoaded", initApp);
