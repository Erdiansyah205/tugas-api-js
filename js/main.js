// Mendapatkan elemen tombol pencarian dan input negara dari DOM
let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");
let resultDiv = document.getElementById("result"); // Mendapatkan elemen hasil pencarian dari DOM
let lastSearchResult = ""; // Variabel untuk menyimpan hasil pencarian terakhir

// Menambahkan event listener pada tombol pencarian
searchBtn.addEventListener("click", searchCountry);

// Menambahkan event listener untuk tombol "Enter"
countryInp.addEventListener("keypress", function (event) {
  // Periksa apakah tombol yang ditekan adalah tombol "Enter"
  if (event.key === "Enter") {
    // Panggil fungsi pencarian negara
    searchCountry();
  }
});

// Fungsi untuk melakukan pencarian negara
function searchCountry() {
  // Mendapatkan nilai negara dari input pengguna
  let countryName = countryInp.value;

  // Periksa apakah input negara kosong
  if (countryName.length === 0) {
    // Jika input negara kosong, tampilkan hasil pencarian terakhir (jika ada)
    if (lastSearchResult) {
      resultDiv.innerHTML = lastSearchResult;
    } else {
      resultDiv.innerHTML = `<h3>The input cannot be empty.</h3>`;
    }
    return; // Hentikan eksekusi lebih lanjut
  }

  // Membuat URL akhir untuk melakukan pencarian negara
  let finalUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  // Mengambil data dari API menggunakan fetch
  fetch(finalUrl)
    .then((response) => {
      // Periksa apakah respons adalah 200 OK
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json(); // Mengonversi respons menjadi JSON
    })
    .then((data) => {
      // Menampilkan data yang diperoleh dari API
      let searchResult = `
        <img src="${data[0].flags.svg}" class="flag-img">
        <h2>${data[0].name.common}</h2>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Capital:</h4>
                <span>${data[0].capital[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Continent:</h4>
                <span>${data[0].continents[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Population:</h4>
                <span>${data[0].population}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Currency:</h4>
                <span>${Object.values(data[0].currencies)[0].name} - ${Object.keys(data[0].currencies)[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Common Languages:</h4>
                <span>${Object.values(data[0].languages).toString().split(",").join(",")}</span>
            </div>
        </div>
      `;
      resultDiv.innerHTML = searchResult;
      lastSearchResult = searchResult; // Menyimpan hasil pencarian terakhir
    })
    .catch((error) => {
      // Menampilkan pesan kesalahan saat terjadi kesalahan dalam mengambil data
      console.error("Failed to fetch data:", error);
      // Menampilkan pesan kesalahan ke dalam elemen dengan id 'result'
      resultDiv.innerHTML = `<h3>Failed to fetch data. Please try again later.</h3>`;
    });
}

// Mendapatkan daftar nama negara dari REST Countries API
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    const countryNames = data.map((country) => country.name.common);

    // Menambahkan event listener untuk input field
    countryInp.addEventListener("input", function () {
      // Mendapatkan nilai input
      let inputValue = this.value.toLowerCase();

      // Filter country names based on input value
      let filteredCountries = countryNames.filter(function (country) {
        return country.toLowerCase().startsWith(inputValue);
      });

      // Display filtered countries as suggestions
      displaySuggestions(filteredCountries);
    });
  })
  .catch((error) => console.error("Failed to fetch country names:", error));

// Fungsi untuk menampilkan saran negara
function displaySuggestions(suggestions) {
  // Membuat HTML untuk menampilkan saran negara
  let suggestionHTML = suggestions
    .map(function (country) {
      return `<div tabindex="0">${country}</div>`; // Menambahkan atribut tabindex
    })
    .join("");

  // Menampilkan saran negara pada elemen hasil pencarian
  resultDiv.innerHTML = suggestionHTML;

  // Mendapatkan kembali elemen saran negara setelah dirender ulang
  let suggestionDivs = resultDiv.querySelectorAll("div");

  // Menambahkan event listener untuk menangani klik pada saran negara
  suggestionDivs.forEach(function (div, index) {
    div.addEventListener("click", function () {
      // Set nilai input negara menjadi nama negara yang dipilih
      countryInp.value = this.textContent;
      // Kosongkan saran negara
      resultDiv.innerHTML = "";
    });

    // Menambahkan event listener untuk menangani navigasi menggunakan tombol enter pada saran negara
    div.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        // Set nilai input negara menjadi nama negara yang dipilih
        countryInp.value = this.textContent;
        // Kosongkan saran negara
        resultDiv.innerHTML = "";
      }
    });
  });

  // Menambahkan event listener untuk input field
  countryInp.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      // Mencegah perilaku default dari tombol panah bawah
      event.preventDefault();
      if (suggestionDivs.length > 0) {
        // Fokus pada elemen pertama dalam daftar saran negara
        suggestionDivs[0].focus();
      }
    }
  });

  // Menambahkan event listener untuk menangani navigasi menggunakan tombol panah bawah
  suggestionDivs.forEach(function (div, index) {
    div.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        // Mencegah perilaku default dari tombol panah bawah
        event.preventDefault();
        // Mendapatkan indeks elemen yang saat ini difokuskan
        let currentIndex = Array.from(suggestionDivs).indexOf(this);
        // Mendapatkan elemen saudara berikutnya yang memiliki tabindex
        let nextSibling = suggestionDivs[currentIndex + 1];
        if (nextSibling) {
          // Fokus pada elemen saudara berikutnya
          nextSibling.focus();
        }
      }
    });
  });
}
