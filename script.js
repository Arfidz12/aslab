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

// Redirect setelah Check-In
function initCheckinRedirect() {
  const formGuest = document.querySelector("#guestbook .form");
  if (formGuest) {
    formGuest.addEventListener("submit", function (e) {
      e.preventDefault(); // cegah reload
      window.location.href = "checkin.html"; // arahkan ke halaman check-in
    });
  }

  const formAslab = document.querySelector("#aslab .form");
  if (formAslab) {
    formAslab.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "checkin.html"; // bisa arahkan ke halaman shift juga kalau beda
    });
  }
}

export function initApp() {
  initClock();
  initNavigation();
  initCheckinRedirect(); // aktifkan redirect
}

document.addEventListener("DOMContentLoaded", initApp);
