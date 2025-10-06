function showForm(type) {
  const wargaForm = document.getElementById('formWarga');
  const asistenForm = document.getElementById('formAsisten');
  const tabs = document.querySelectorAll('.tab');

  if (type === 'warga') {
    wargaForm.classList.remove('hidden');
    asistenForm.classList.add('hidden');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    wargaForm.classList.add('hidden');
    asistenForm.classList.remove('hidden');
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
  }
}

function toggleKhususShift() {
  const shiftSelect = document.getElementById('shift');
  const khususGroup = document.getElementById('khususShiftGroup');
  khususGroup.classList.toggle('hidden', shiftSelect.value !== 'Khusus');
}

function updateClock() {
  const now = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('id-ID', options);
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' , second: '2-digit' });
  document.getElementById('clock').textContent = `${dateStr} pukul ${timeStr}`;
}
setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const now = new Date();
    const tanggal = now.toLocaleDateString("id-ID", {day: "2-digit", month: "long", year: "numeric"});
    const jam = now.toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"});
    const waktuMasuk = `${tanggal}, ${jam}`;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.shift === "Khusus") {
      data.keperluan = document.getElementById("khususShift").value || "Shift Khusus";
    } else if (data.shift) {
      data.keperluan = data.shift;
    }

    data.waktuMasuk = waktuMasuk;
    data.waktuKeluar = null;
    data.status = "Di Lab";
    data.kunjunganId = Date.now();

    const daftarTamu = JSON.parse(localStorage.getItem("daftarTamu") || "[]");
    daftarTamu.push(data);
    localStorage.setItem("daftarTamu", JSON.stringify(daftarTamu));

    // Pop-up berhasil registrasi
    function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000); // Durasi pop-up
  }

    showToast("✅ Registrasi berhasil! Data Anda telah disimpan.");
    form.reset();
  });
});

function goToMainPage() {
  window.location.href = "main.html";
}
