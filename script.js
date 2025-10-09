// script.js (Versi Final dengan Logika Aslab Terpisah)

let activeFormType = 'warga';

// --- FUNGSI UI (Tidak ada perubahan) ---
function showForm(type) {
    const wargaForm = document.getElementById('formWarga');
    const asistenForm = document.getElementById('formAsisten');
    const tabs = document.querySelectorAll('.tab');
    activeFormType = type;
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
function goToMainPage() {
    window.location.href = "main.html";
}
// --- AKHIR FUNGSI UI ---


// --- FUNGSI UNTUK CHECK-IN WARGA LAB (YANG LAMA) ---
async function handleWargaSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const emailDomain = data.email.split('@')[1];
        if (emailDomain.toLowerCase() !== 'gmail.com') {
            throw new Error("Hanya email @gmail.com yang diizinkan.");
        }

        let { data: user, error: userError } = await supabase.from('users').select('id').eq('email', data.email).single();
        if (userError && userError.code !== 'PGRST116') throw userError;

        if (!user) {
            const { data: newUser, error: newUserError } = await supabase.from('users').insert(
                {   name: data.nama, 
                    student_id: data.id, 
                    email: data.email, 
                    role: 'warga' 
                }).select('id').single();

            if (newUserError) throw newUserError;
            user = newUser;
        }

        const { error: visitError } = await supabase.from('visits').insert(
            {   user_id: user.id,
                name: data.nama, 
                purpose: data.keperluan 
            });
        if (visitError) throw visitError;

        showToast(`✅ Check-in untuk ${data.nama} berhasil!`);
        form.reset();
    } catch (error) {
        console.error("Error saat check-in:", error);
        showToast(`❌ Error: ${error.message}`, true);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}


// --- FUNGSI BARU UNTUK CHECK-IN ASISTEN LAB ---
async function handleAslabSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Langkah 1: Cari Aslab di database berdasarkan ID dan role
        const { data: aslab, error: aslabError } = await supabase
            .from('users')
            .select('id, name') // Ambil id dan nama
            .eq('student_id', parseInt(data.id))
            .eq('role', 'Asisten Lab')
            .single();
        
        // Jika Aslab tidak ditemukan, lempar error
        if (aslabError || !aslab) {
            throw new Error("ID Asisten tidak ditemukan atau tidak valid.");
        }

        // Tentukan nilai 'purpose'
        let purposeValue = data.shift;
        if (data.shift === 'Khusus') {
            purposeValue = data.khususShift || 'Shift Khusus';
        }

        // Langkah 2: Catat kunjungan untuk Aslab yang ditemukan
        const { error: visitError } = await supabase
            .from('visits')
            .insert({
                user_id: aslab.id,
                name: aslab.name,
                purpose: purposeValue,
            });
        
        if (visitError) throw visitError;

        showToast(`✅ Selamat datang, ${aslab.name}! Check-in berhasil.`);
        form.reset();

    } catch (error) {
        console.error("Error saat check-in Aslab:", error);
        showToast(`❌ Error: ${error.message}`, true);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

// --- EVENT LISTENER (Sekarang memanggil fungsi yang berbeda) ---
document.getElementById('formWarga').addEventListener('submit', handleWargaSubmit);
document.getElementById('formAsisten').addEventListener('submit', handleAslabSubmit);