// Timer untuk update durasi shift
let startTime = new Date('2025-09-29T20:11:40');

function updateDuration() {
  const now = new Date();
  const diff = now - startTime;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  document.querySelector('.duration-value').textContent = `${hours}j ${minutes}m`;

  // Update waktu saat ini
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/:/g, '.');

  document.querySelector('.duration-info').textContent = `Waktu saat ini: ${timeStr}`;
}

// Update setiap detik
setInterval(updateDuration, 1000);
updateDuration(); // panggilan pertama

function endShift() {
  if (confirm('Apakah Anda yakin ingin mengakhiri shift piket?')) {
    alert('Shift piket telah berakhir. Terima kasih!');
    // contoh: bisa redirect ke beranda
    // window.location.href = '/beranda';
  }
}