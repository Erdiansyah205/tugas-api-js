// Mendapatkan elemen tombol pencarian dan input negara dari DOM
let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");

// Menambahkan event listener pada tombol pencarian
searchBtn.addEventListener("click", () => {
  // Mendapatkan nilai negara dari input pengguna
  let countryName = countryInp.value;

  // Periksa apakah input negara kosong
  if (countryName.length === 0) {
    // Jika input negara kosong, tampilkan pesan ke dalam elemen dengan id 'result'
    result.innerHTML = `<h3>The input cannot be empty.</h3>`;
    return; // Hentikan eksekusi lebih lanjut
  }

  // Membuat URL akhir untuk melakukan pencarian negara
  let finalUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  console.log(finalUrl);

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
    //   console.log(data[0]);
    //   console.log(data[0].capital[0]);
    //   console.log(data[0].flags.svg);
    //   console.log(data[0].name.common);
    //   console.log(data[0].continents[0]);

      // Menambahkan penanganan kesalahan untuk currencies
      if (data[0].currencies && Array.isArray(data[0].currencies) && data[0].currencies[0]) {
        console.log(Object.keys(data[0].currencies[0]));
      } else {
        console.log("Currency data valid");
      }

      // Menampilkan informasi tentang mata uang dan bahasa negara
    //   console.log(data[0].currencies[Object.keys(data[0].currencies)].name);
    //   console.log(Object.values(data[0].languages).toString().split(",").join(","));

      // Menampilkan hasil pencarian ke dalam elemen dengan id 'result'
      result.innerHTML = `
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
    })
    .catch((error) => {
      // Menampilkan pesan kesalahan saat terjadi kesalahan dalam mengambil data
      console.error("Failed to fetch data:", error);
      // Menampilkan pesan kesalahan ke dalam elemen dengan id 'result'
      result.innerHTML = `<h3>Failed to fetch data. Please try again later.</h3>`;
    });
});
