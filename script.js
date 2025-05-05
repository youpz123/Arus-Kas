// Menangani elemen input yang digunakan untuk kas masuk dan kas keluar
const incomeInputs = document.querySelectorAll('.income'); // Mengambil semua input dengan kelas 'income'
const expenseInputs = document.querySelectorAll('.expense'); // Mengambil semua input dengan kelas 'expense'

// Menangani elemen-elemen HTML yang menampilkan total dan surplus/defisit
const totalIncomeEl = document.getElementById('totalIncome'); // Elemen untuk menampilkan total kas masuk
const totalExpenseEl = document.getElementById('totalExpense'); // Elemen untuk menampilkan total kas keluar
const surplusBox = document.getElementById('surplusBox'); // Elemen untuk menampilkan surplus/defisit

// Menangani elemen input untuk kewajiban, investasi, dan biaya hidup
const kewajibanInput = document.getElementById('kewajiban'); 
const jangkaPanjangInput = document.getElementById('jangkaPanjang');
const jangkaPendekInput = document.getElementById('jangkaPendek');
const danaDaruratInput = document.getElementById('danaDarurat');
const tabunganKasInput = document.getElementById('tabunganKas');
const totalInvestasiInput = document.getElementById('totalInvestasi');
const biayaHidupInput = document.getElementById('biayaHidupTotal');

let chart; // Variabel untuk menyimpan objek chart yang akan digunakan untuk grafik pie

// Fungsi untuk mengubah format input "Rp" menjadi angka
function parseRupiah(value) {
  return Number(value.replace(/[^0-9]/g, "")) || 0; // Menghilangkan semua karakter non-digit dan mengembalikan angka
}

// Fungsi untuk mengubah angka menjadi format "Rp"
function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID"); // Menambahkan format "Rp" dan pemisah ribuan
}

// Menangani format input saat pengguna mengetik
function handleInputFormat(e) {
  const input = e.target; // Mengambil elemen input yang sedang diedit
  const value = parseRupiah(input.value); // Mengubah input menjadi angka
  input.value = value ? formatRupiah(value) : ""; // Jika valid, format ulang menjadi format "Rp"
  calculateTotals(); // Menghitung ulang total setelah perubahan input
}

// Menghitung total kewajiban (jangka panjang + jangka pendek)
function updateKewajiban() {
  const total = parseRupiah(jangkaPanjangInput.value) + parseRupiah(jangkaPendekInput.value); // Menjumlahkan kewajiban
  kewajibanInput.value = formatRupiah(total); // Menampilkan total kewajiban dalam format "Rp"
}

// Menghitung total investasi (dana darurat + tabungan kas)
function updateInvestasi() {
  const total = parseRupiah(danaDaruratInput.value) + parseRupiah(tabunganKasInput.value); // Menjumlahkan investasi
  totalInvestasiInput.value = formatRupiah(total); // Menampilkan total investasi dalam format "Rp"
}

// Menghitung total biaya hidup
function updateBiayaHidup() {
  let total = 0;
  let start = false;
  expenseInputs.forEach(input => {
    if (input.id === 'biayaHidupTotal') start = true; // Memulai perhitungan dari biaya hidup total
    else if (start) total += parseRupiah(input.value); // Menambahkan biaya hidup setelahnya
  });
  biayaHidupInput.value = formatRupiah(total); // Menampilkan total biaya hidup dalam format "Rp"
}

// Fungsi utama untuk menghitung semua total dan surplus/defisit
function calculateTotals() {
  updateKewajiban(); // Memperbarui kewajiban
  updateInvestasi(); // Memperbarui investasi
  updateBiayaHidup(); // Memperbarui biaya hidup

  // Menghitung total kas masuk
  const totalIncome = [...incomeInputs].reduce((sum, input) => sum + parseRupiah(input.value), 0);
  // Menghitung total kas keluar (kewajiban + investasi + biaya hidup)
  const kewajiban = parseRupiah(kewajibanInput.value);
  const investasi = parseRupiah(totalInvestasiInput.value);
  const biayaHidup = parseRupiah(biayaHidupInput.value);
  const totalExpense = kewajiban + investasi + biayaHidup;
  const surplus = totalIncome - totalExpense; // Menghitung surplus/defisit

  // Menampilkan hasil total kas masuk dan kas keluar
  totalIncomeEl.textContent = formatRupiah(totalIncome);
  totalExpenseEl.textContent = formatRupiah(totalExpense);
  surplusBox.textContent = `Surplus/Defisit: ${formatRupiah(surplus)}`; 
  surplusBox.style.backgroundColor = surplus > 0 ? 'green' : surplus < 0 ? 'red' : 'black'; // Mengubah warna latar belakang berdasarkan surplus/defisit

  // Menghitung persentase kewajiban, investasi, biaya hidup, dan surplus/defisit terhadap kas masuk
  const kewajibanPercentage = totalIncome ? (kewajiban / totalIncome) * 100 : 0;
  const investasiPercentage = totalIncome ? (investasi / totalIncome) * 100 : 0;
  const biayaHidupPercentage = totalIncome ? (biayaHidup / totalIncome) * 100 : 0;
  const surplusPercentage = totalIncome ? (surplus / totalIncome) * 100 : 0;

  // Menampilkan persentase pada elemen masing-masing
  const kewajibanEl = document.getElementById("percentKewajiban");
  kewajibanEl.textContent = `${kewajibanPercentage.toFixed(2)}%`; // Menampilkan persentase kewajiban
  kewajibanEl.style.color = kewajibanPercentage > 30 ? "red" : "black"; // Mengubah warna teks jika kewajiban lebih dari 30%

  document.getElementById("percentInvestasi").textContent = `${investasiPercentage.toFixed(2)}%`;
  document.getElementById("percentBiayaHidup").textContent = `${biayaHidupPercentage.toFixed(2)}%`;
  document.getElementById("percentSurplusDefisit").textContent = `${surplusPercentage.toFixed(2)}%`;

  updateChart(totalIncome, totalExpense); // Memperbarui grafik
}

// Fungsi untuk mereset semua input dan menghitung ulang total
function resetForm() {
  if (confirm("Yakin ingin mereset semua data?")) { // Menanyakan konfirmasi untuk reset
    [...incomeInputs, ...expenseInputs, jangkaPanjangInput, jangkaPendekInput, danaDaruratInput, tabunganKasInput, kewajibanInput, totalInvestasiInput, biayaHidupInput]
      .forEach(input => {
        input.value = ""; // Mengosongkan semua input
      });
    calculateTotals(); // Menghitung ulang total
  }
}

// Fungsi untuk memperbarui grafik pie chart
function updateChart(totalIncome, totalExpense) {
  if (chart) {
    chart.destroy(); // Menghancurkan chart yang lama sebelum membuat chart baru
  }

  const kewajiban = parseRupiah(kewajibanInput.value);
  const investasi = parseRupiah(totalInvestasiInput.value);
  const biayaHidup = parseRupiah(biayaHidupInput.value);
  const surplus = totalIncome - (kewajiban + investasi + biayaHidup); // Menghitung surplus

  // Membuat chart pie menggunakan Chart.js
  chart = new Chart(document.getElementById("pieChartCanvas"), {
    type: "pie", // Tipe chart adalah pie chart
    data: {
      labels: ["Kewajiban", "Investasi", "Biaya Hidup", "Surplus/Defisit"], // Label kategori chart
      datasets: [{
        data: [kewajiban, investasi, biayaHidup, surplus], // Data yang ditampilkan di chart
        backgroundColor: ['red', 'blue', 'orange', 'green'] // Warna untuk masing-masing kategori
      }]
    }
  });
}

// Fungsi untuk mengaktifkan atau menonaktifkan mode gelap
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode"); // Menambah/menghapus kelas 'dark-mode' pada body
}

// Fungsi untuk mengekspor data menjadi gambar PNG
function eksporGambar() {
  html2canvas(document.querySelector(".container")).then((canvas) => { // Mengambil screenshot dari kontainer
    const link = document.createElement("a");
    link.download = "ArusKas.png"; // Menentukan nama file gambar
    link.href = canvas.toDataURL(); // Mengambil data gambar dalam format base64
    link.click(); // Mengunduh gambar
  });
}

// Menambahkan event listener pada setiap input untuk memformat saat pengguna mengetik
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", handleInputFormat);
});

// Menghitung total saat pertama kali halaman dimuat
calculateTotals();
