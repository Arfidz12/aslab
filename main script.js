// main script.js (Versi Final Terbaru)

// --- FUNGSI UI (Tidak ada perubahan) ---
function updateClock() {
    const now = new Date();
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('id-ID', options);
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('clock').textContent = `${dateStr} pukul ${timeStr}`;
}
setInterval(updateClock, 1000);
updateClock();

function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = "toast";
    if (isError) {
        toast.style.backgroundColor = '#B9332E';
    }
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
// --- AKHIR FUNGSI UI ---


// ===================================================================
// BAGIAN UTAMA LOGIKA SUPABASE
// ===================================================================

const guestListContainer = document.querySelector('.guest-list');

async function fetchAndRenderGuests() {
    // Kueri diubah agar lebih efisien: kita hanya butuh 'role' dan 'email' dari tabel users
    const { data: visits, error } = await supabase
        .from('visits')
        .select('*, users(role, email)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error mengambil data:", error);
        guestListContainer.innerHTML = '<p style="color: red;">Gagal memuat data.</p>';
        return;
    }

    if (visits.length === 0) {
        guestListContainer.innerHTML = '<p>Belum ada tamu yang check-in hari ini.</p>';
        return;
    }

    let cardsHTML = '';
    visits.forEach(visit => {
        const user = visit.users;
        const sudahCheckout = visit.status === 'Selesai';
        
        // Buat variabel untuk label role
        let roleLabel = '';
        if (user && user.role === 'Asisten Lab') {
            roleLabel = '<br><span class="role-label">Asisten Lab</span>';
        }

        const waktuMasuk = new Date(visit.check_in_time).toLocaleString('id-ID', { hour12: false });
        const waktuKeluar = visit.check_out_time ? new Date(visit.check_out_time).toLocaleString('id-ID', { hour12: false }) : '-';
        
        // Ambil nama langsung dari tabel 'visits'
        const userName = visit.name || 'Nama Tidak Ditemukan';
        const userEmail = user ? user.email : '';
        const labelKeperluan = (user && user.role === 'aslab') ? 'Shift' : 'Keperluan';

        cardsHTML += `
          <div class="guest-card">
            <div class="guest-row">
              <div class="guest-item">
                <span class="guest-label">Nama</span><br>
                ${!sudahCheckout ?
                  `<button class="checkout-btn" 
                      data-visit-id="${visit.id}" 
                      data-user-name="${userName}"
                      data-user-email="${userEmail}">
                      ${userName}
                   </button>${roleLabel}` :
                  `<span class="guest-value">${userName}</span>${roleLabel}`
                }
              </div>

              <div class="guest-item">
                <span class="guest-label">${labelKeperluan}</span><br>
                <span class="guest-value">${visit.purpose || "-"}</span>
              </div>
              <div class="guest-item">
                <span class="guest-label">Waktu Masuk</span><br>
                <span class="guest-value">${waktuMasuk}</span>
              </div>
              <div class="guest-item">
                <span class="guest-label">Waktu Keluar</span><br>
                <span class="guest-value">${waktuKeluar}</span>
              </div>
              <div class="guest-item">
                <span class="guest-label">Status</span><br>
                <span class="guest-status ${sudahCheckout ? 'status-selesai' : 'status-lab'}">
                  ${visit.status}
                </span>
              </div>
            </div>
          </div>
        `;
    });

    guestListContainer.innerHTML = cardsHTML;

    document.querySelectorAll(".checkout-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const visitId = this.dataset.visitId;
            const userName = this.dataset.userName;
            const userEmail = this.dataset.userEmail;
            showConfirmDialog(visitId, userName, userEmail);
        });
    });
}


// --- LOGIKA CHECKOUT (Tidak ada perubahan) ---
function showConfirmDialog(visitId, userName, userEmail) {
    const oldDialog = document.querySelector('.confirm-dialog');
    if (oldDialog) oldDialog.remove();
    const oldOverlay = document.querySelector('.overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const dialog = document.createElement("div");
    dialog.className = "confirm-dialog";
    dialog.innerHTML = `<h3>Check-out untuk ${userName}</h3><p>Kami akan mengirim kode konfirmasi ke email Anda.</p><div class="form-actions" style="justify-content: center; gap: 12px;"><button class="btn btn-secondary" id="cancelBtn">Batal</button><button class="btn btn-primary" id="confirmBtn">Kirim Kode</button></div>`;
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    document.getElementById('confirmBtn').onclick = () => handleRequestCode(visitId, userEmail, dialog);
    document.getElementById('cancelBtn').onclick = () => { dialog.remove(); overlay.remove(); };
    overlay.onclick = () => { dialog.remove(); overlay.remove(); };
}

async function handleRequestCode(visitId, userEmail, dialog) {
    const confirmBtn = dialog.querySelector('#confirmBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Mengirim...';

    try {
        const { error } = await supabase.auth.signInWithOtp({ email: userEmail });
        if (error) throw error;
        
        showToast('✅ Kode verifikasi telah dikirim.');
        dialog.innerHTML = `<h3>Masukkan Kode Verifikasi</h3><p>Periksa email Anda dan masukkan 6 digit kode.</p><div class="form-group"><input type="text" id="codeInput" placeholder="______" maxlength="6" style="text-align: center; font-size: 1.5rem; letter-spacing: 0.5rem;"></div><div class="form-actions"><button class="btn btn-secondary" id="cancelBtn">Batal</button><button class="btn btn-primary" id="verifyBtn">Verifikasi & Check-out</button></div>`;
        
        document.getElementById('verifyBtn').onclick = () => {
            const code = document.getElementById('codeInput').value;
            handleConfirmCheckout(visitId, userEmail, code, dialog);
        };
        document.getElementById('cancelBtn').onclick = () => dialog.remove();
    } catch (error) {
        console.error("Gagal mengirim kode:", error);
        showToast(`❌ Error: ${error.message}`, true);
        dialog.remove();
    }
}

async function handleConfirmCheckout(visitId, userEmail, code, dialog) {
    const verifyBtn = dialog.querySelector('#verifyBtn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Memverifikasi...';

    try {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({ email: userEmail, token: code, type: 'email' });
        if (verifyError) throw verifyError;

        const { error: updateError } = await supabase
            .from('visits')
            .update({ 
                check_out_time: new Date(),
                status: 'Selesai' 
            })
            .eq('id', visitId);

        if (updateError) throw updateError;

        showToast(`✅ Check-out berhasil!`);
        dialog.remove();

    } catch (error) {
        console.error("Gagal check-out:", error);
        showToast(`❌ Error: ${error.message}`, true);
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verifikasi & Check-out';
    }
}


// --- REALTIME LISTENER (Tidak ada perubahan) ---
const channel = supabase.channel('db-changes')
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'visits'
    },
    (payload) => {
        console.log('Perubahan terdeteksi!', payload);
        fetchAndRenderGuests();
    })
    .subscribe();


// --- INISIALISASI ---
fetchAndRenderGuests();