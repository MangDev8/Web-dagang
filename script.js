// ===============================
// GLOBAL VARIABEL
// ===============================
let currentData = {};
let currentMapLink = "";

// ===============================
// NAVIGATION MENU TOGGLE
// ===============================
function toggleMenu() {
  document.querySelector('.menu').classList.toggle('active');
  document.querySelector('.hamburger').classList.toggle('active');
}

// ===============================
// FORM PEMESANAN
// ===============================
function openFormByData(nama, harga) {
  currentData = { nama, harga };
  currentMapLink = "";
  
  document.getElementById("form-nama").innerText = nama;
  document.getElementById("form-user").value = "";
  document.getElementById("form-alamat").value = "";
  document.getElementById("form-jumlah").value = 1;
  document.getElementById("lokasi-link").innerText = "";
  document.querySelectorAll('input[name="metode"]').forEach(el => el.checked = false);
  
  document.getElementById("modalForm").style.display = "block";
}

function closeForm() {
  document.getElementById("modalForm").style.display = "none";
}

// ===============================
// LOKASI GPS
// ===============================
function getLocation() {
  if (!navigator.geolocation) {
    alert("Browser tidak mendukung GPS.");
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      currentMapLink = `https://www.google.com/maps?q=${lat},${lon}`;
      document.getElementById("lokasi-link").innerText = "📍 Lokasi berhasil ditambahkan.";
    },
    (err) => {
      console.error(err);
      alert("Gagal ambil lokasi. Pastikan GPS aktif.");
    }
  );
}

// ===============================
// KIRIM PESAN KE WHATSAPP
// ===============================
function submitToWA() {
  const user = document.getElementById("form-user").value.trim();
  const alamat = document.getElementById("form-alamat").value.trim();
  const jumlah = parseInt(document.getElementById("form-jumlah").value.trim());
  const metode = document.querySelector('input[name="metode"]:checked')?.value || "";
  
  if (!user || !alamat || !jumlah || !metode) {
    alert("Mohon lengkapi semua data terlebih dahulu!");
    return;
  }
  
  const hargaText = currentData.harga.replace(/[^\d]/g, '');
  const hargaAngka = parseInt(hargaText);
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
  closeForm();
}

// ===============================
// TAMPILKAN PRODUK DETAIL
// ===============================
function tampilkanDetailProduk(nama, harga, gambar, deskripsi) {
  document.getElementById("detail-nama").innerText = nama;
  document.getElementById("detail-harga").innerText = harga;
  document.getElementById("detail-gambar").src = gambar;
  document.getElementById("detail-deskripsi").innerText = deskripsi;
  
  const pesan = `Halo, saya tertarik dengan produk: ${nama} seharga ${harga}. Bisa info lebih lanjut?`;
  document.getElementById("detail-wa").href = `https://wa.me/6281772857916?text=${encodeURIComponent(pesan)}`;
  
  document.getElementById("detailProdukPage").style.display = "block";
}

function tutupDetailProduk() {
  document.getElementById("detailProdukPage").style.display = "none";
}

// ===============================
// DARI PRODUK DETAIL KE FORM
// ===============================
function openOrderFromDetail() {
  const nama = document.getElementById("detail-nama").innerText;
  const harga = document.getElementById("detail-harga").innerText;
  tutupDetailProduk();
  openFormByData(nama, harga);
}