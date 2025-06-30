// ===============================
// GLOBAL VARIABEL (Pertahankan)
// ===============================
let currentData = {};
let currentMapLink = "";

// ======================================================
// FUNGSI UTAMA YANG DIJALANKAN SAAT DOM SELESAI DIMUAT
// ======================================================
document.addEventListener('DOMContentLoaded', function() {
    // Ambil elemen-elemen DOM yang diperlukan untuk Navbar dan Overlay
    const hamburger = document.getElementById('hamburger');
    const mainMenu = document.getElementById('mainMenu'); // ul.menu
    const mobileOverlay = document.getElementById('mobileOverlay'); // div overlay
    const body = document.body; // body element
    const closeNavbarBtn = document.getElementById('closeNavbar'); // Tombol close di dalam navbar

    // Fungsi untuk menutup navbar (digunakan oleh overlay, tombol close, dan item menu)
    function closeNavbar() {
        mainMenu.classList.remove('active');
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.classList.remove('no-scroll'); // Hapus kelas no-scroll dari body
    }

    // Fungsi untuk membuka/menutup navbar (dipicu oleh hamburger)
    // Kita tidak lagi memanggil toggleMenu dari HTML
    if (hamburger && mainMenu && mobileOverlay) {
        hamburger.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll'); // Toggle kelas no-scroll pada body
        });

        // Tutup navbar ketika overlay diklik
        mobileOverlay.addEventListener('click', closeNavbar);

        // Tutup navbar ketika tombol close di dalamnya diklik
        if (closeNavbarBtn) {
            closeNavbarBtn.addEventListener('click', closeNavbar);
        }

        // Tutup navbar ketika item menu diklik (di layar mobile saja)
        mainMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                // Hanya tutup jika lebar layar <= 768px (diasumsikan mobile breakpoint)
                if (window.innerWidth <= 768) {
                    closeNavbar();
                }
            });
        });
    }

    // ===============================
    // FUNGSI FORM PEMESANAN (Dipindahkan ke window agar bisa diakses dari onclick di HTML)
    // ===============================
    window.openFormByData = function(nama, harga) {
        currentData = { nama, harga };
        currentMapLink = "";
        
        document.getElementById("form-nama").innerText = nama;
        document.getElementById("form-user").value = "";
        document.getElementById("form-alamat").value = "";
        document.getElementById("form-jumlah").value = 1;
        document.getElementById("lokasi-link").innerText = "";
        document.querySelectorAll('input[name="metode"]').forEach(el => el.checked = false);
        
        document.getElementById("modalForm").style.display = "block";
        body.classList.add('no-scroll'); // Tambahkan no-scroll saat modal form terbuka
    }

    window.closeForm = function() {
        document.getElementById("modalForm").style.display = "none";
        body.classList.remove('no-scroll'); // Hapus no-scroll saat modal form tertutup
    }

    // ===============================
    // FUNGSI LOKASI GPS (Dipindahkan ke window)
    // ===============================
    window.getLocation = function() {
        const lokasiLink = document.getElementById("lokasi-link");
        if (!navigator.geolocation) {
            lokasiLink.innerText = "Browser tidak mendukung GPS.";
            return;
        }
        
        lokasiLink.innerText = "Mendapatkan lokasi...";
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                currentMapLink = `http://maps.google.com/?q=${lat},${lon}`; // Perbaiki link Google Maps
                lokasiLink.innerHTML = `📍 Lokasi berhasil ditambahkan: <a href="${currentMapLink}" target="_blank">Lihat di Peta</a>`;
            },
            (err) => {
                console.error(err);
                lokasiLink.innerText = "Gagal ambil lokasi. Pastikan GPS aktif.";
            }
        );
    }

    // ===============================
    // FUNGSI KIRIM PESAN KE WHATSAPP (Dipindahkan ke window)
    // ===============================
    window.submitToWA = function() {
        const user = document.getElementById("form-user").value.trim();
        const alamat = document.getElementById("form-alamat").value.trim();
        const jumlah = parseInt(document.getElementById("form-jumlah").value.trim());
        const metode = document.querySelector('input[name="metode"]:checked')?.value || "";
        
        if (!user || !alamat || isNaN(jumlah) || jumlah <= 0 || !metode) { // Tambah validasi jumlah
            alert("Mohon lengkapi semua data terlebih dahulu dan pastikan jumlah benar!");
            return;
        }
        
        const hargaText = currentData.harga.replace(/[^\d,]/g, '').replace(',', '.'); // Handle koma desimal jika ada
        const hargaAngka = parseFloat(hargaText); // Gunakan parseFloat untuk harga
        const total = hargaAngka * jumlah;
        const totalRp = "Rp " + total.toLocaleString("id-ID");
        
        let transferNote = "";
        if (["OVO", "GOPAY"].includes(metode)) {
            transferNote = `📱 *Silakan transfer ke:* 6281772857916 a.n. Warung Tuak\n📝 Mohon konfirmasi setelah transfer dilakukan.\n`;
        }
        
        const pesan = `*📦 PESANAN BARU*\n\n` +
            `🍹 *Produk:* ${currentData.nama}\n` +
            `💰 *Harga Satuan:* ${currentData.harga}\n` +
            `🔢 *Jumlah:* ${jumlah}\n` +
            `💵 *Total Bayar:* ${totalRp}\n\n` +
            `👤 *Nama:* ${user}\n` +
            `📍 *Alamat:* ${alamat}\n` +
            `${currentMapLink ? "🌐 *Link Lokasi:* " + currentMapLink + "\n" : ""}` +
            `💳 *Metode Pembayaran:* ${metode}\n` +
            `${transferNote}` +
            `🙏 Terima kasih, mohon diproses ya.`;
        
        window.open(`https://wa.me/6281772857916?text=${encodeURIComponent(pesan)}`, "_blank");
        window.closeForm(); // Panggil fungsi closeForm melalui window
    }

    // ===============================
    // FUNGSI TAMPILKAN PRODUK DETAIL (Dipindahkan ke window)
    // ===============================
    window.tampilkanDetailProduk = function(nama, harga, gambar, deskripsi) {
        document.getElementById("detail-nama").innerText = nama;
        document.getElementById("detail-harga").innerText = harga;
        document.getElementById("detail-gambar").src = gambar;
        document.getElementById("detail-deskripsi").innerText = deskripsi;
        
        const pesan = `Halo, saya tertarik dengan produk: ${nama} seharga ${harga}. Bisa info lebih lanjut?`;
        document.getElementById("detail-wa").href = `https://wa.me/6281772857916?text=${encodeURIComponent(pesan)}`;
        
        document.getElementById("detailProdukPage").style.display = "block";
        body.classList.add('no-scroll'); // Tambahkan no-scroll saat detail produk terbuka
    }

    window.tutupDetailProduk = function() {
        document.getElementById("detailProdukPage").style.display = "none";
        body.classList.remove('no-scroll'); // Hapus no-scroll saat detail produk tertutup
    }

    // ===============================
    // FUNGSI DARI PRODUK DETAIL KE FORM (Dipindahkan ke window)
    // ===============================
    window.openOrderFromDetail = function() {
        const nama = document.getElementById("detail-nama").innerText;
        const harga = document.getElementById("detail-harga").innerText;
        window.tutupDetailProduk(); // Panggil fungsi tutupDetailProduk melalui window
        window.openFormByData(nama, harga); // Panggil fungsi openFormByData melalui window
    }

    // Tambahan: Tutup modal/form jika area di luar modal diklik
    const modalForm = document.getElementById('modalForm');
    const detailProdukPage = document.getElementById('detailProdukPage');

    if (modalForm) {
        modalForm.addEventListener('click', function(event) {
            if (event.target === modalForm) {
                window.closeForm();
            }
        });
    }

    if (detailProdukPage) {
        detailProdukPage.addEventListener('click', function(event) {
            if (event.target === detailProdukPage) {
                window.tutupDetailProduk();
            }
        });
    }

    // Jika kamu punya floating WA button yang memicu modal pemesanan, pastikan ini ada di HTML dan JS
    const waFloat = document.querySelector('.wa-float'); // Asumsi ada elemen dengan class ini
    if (waFloat) {
        waFloat.addEventListener('click', function(e) {
            e.preventDefault();
            // Inisialisasi form pemesanan untuk "General Inquiry" jika dipicu dari floating button
            window.openFormByData('General Inquiry/Pemesanan', 'Rp0'); // Atau string kosong
        });
    }

}); // Penutup DOMContentLoaded
