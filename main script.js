function updateClock() {
  const now = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('id-ID', options);
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('clock').textContent = `${dateStr} pukul ${timeStr}`;
}
setInterval(updateClock, 1000);
updateClock();

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showConfirmDialog(kunjunganId, onConfirm) {
  // Buat overlay
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  // Buat dialog
  const dialog = document.createElement("div");
  dialog.className = "confirm-dialog";
  dialog.innerHTML = `
    <h3>Konfirmasi Check-out<br>Apakah Anda ingin check-out?</h3>
    <button class="confirm-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Ya
    </button>
  `;

  // Gabungkan ke body
  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  // Event tombol Ya
  dialog.querySelector(".confirm-btn").addEventListener("click", () => {
    overlay.remove();
    dialog.remove();
    onConfirm(kunjunganId);
  });
}

function tampilkanTamu() {
  const daftarTamu = JSON.parse(localStorage.getItem('daftarTamu') || '[]');
  const guestList = document.querySelector('.guest-list');
  guestList.innerHTML = '';

  daftarTamu.forEach(tamu => {
    const labelKeperluan = tamu.shift ? "Shift" : "Keperluan";
    const isiKeperluan = tamu.shift || tamu.keperluan || "-";
    const sudahCheckout = tamu.waktuKeluar !== null;

    guestList.innerHTML += `
      <div class="guest-card">
        <div class="guest-row">
          <div>
            <span class="guest-label">Nama</span><br>
            ${!sudahCheckout ? 
              `<button class="checkout-btn" data-kunjungan="${tamu.kunjunganId}">${tamu.nama}</button>` :
              `<span class="guest-value">${tamu.nama}</span>`}
          </div>
          <div>
            <span class="guest-label">ID</span><br>
            <span class="guest-value">${tamu.id}</span>
          </div>
          <div>
            <span class="guest-label">${labelKeperluan}</span><br>
            <span class="guest-value">${isiKeperluan}</span>
          </div>
          <div>
            <span class="guest-label">Waktu Masuk</span><br>
            <span class="guest-value">${tamu.waktuMasuk}</span>
          </div>
          <div>
            <span class="guest-label">Waktu Keluar</span><br>
            <span class="guest-value keluar" id="keluar-${tamu.kunjunganId}">${tamu.waktuKeluar || '-'}</span>
          </div>
          <div>
            <span class="guest-label">Status</span><br>
            <span class="guest-status ${tamu.status === 'Selesai' ? 'status-selesai' : 'status-lab'}" id="status-${tamu.kunjunganId}">
              ${tamu.status}
            </span>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".checkout-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const kunjunganId = this.getAttribute("data-kunjungan");
      const keluarField = document.getElementById("keluar-" + kunjunganId);
      const statusField = document.getElementById("status-" + kunjunganId);

      showConfirmDialog(kunjunganId, function(kunjunganId) {
        const now = new Date();
        const tanggal = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
        const jam = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const waktuKeluar = `${tanggal}, ${jam}`;

        keluarField.textContent = waktuKeluar;
        statusField.textContent = "Selesai";
        statusField.classList.remove("status-lab");
        statusField.classList.add("status-selesai");


        const daftarTamu = JSON.parse(localStorage.getItem('daftarTamu') || '[]');
        const index = daftarTamu.findIndex(t => t.kunjunganId == kunjunganId);
        if (index > -1) {
          daftarTamu[index].waktuKeluar = waktuKeluar;
          daftarTamu[index].status = "Selesai";
          localStorage.setItem('daftarTamu', JSON.stringify(daftarTamu));
        }

        showToast("✅ Check-out berhasil!");
        tampilkanTamu(); // Refresh tampilan
      });
    });
  });
}

tampilkanTamu();
