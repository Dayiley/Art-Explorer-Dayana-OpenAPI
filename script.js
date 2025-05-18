document.addEventListener("DOMContentLoaded", () => {
    const birthYearForm = document.getElementById("birthYearForm");
    if (birthYearForm) {
      birthYearForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const year = document.getElementById("birthYear").value;
        const gallery = document.getElementById("artGallery");
        gallery.innerHTML = "<p>Loading...</p>";

        try {
          let res = await fetch(`https://api.artic.edu/api/v1/artworks/search?query[term][date_end]=${year}&fields=id,title,image_id,artist_display,date_display,medium_display&limit=10`);
          let data = await res.json();
          let artworks = data.data;

          if (artworks.length === 0) {
            res = await fetch(`https://api.artic.edu/api/v1/artworks/search?query[term][date_start]=${year}&fields=id,title,image_id,artist_display,date_display,medium_display&limit=10`);
            data = await res.json();
            artworks = data.data;
          }

          gallery.innerHTML = artworks.length
            ? artworks.map(art => `
                <div class="bg-white rounded shadow p-2">
                  <img src="https://www.artic.edu/iiif/2/${art.image_id}/full/300,/0/default.jpg" alt="${art.title}" class="w-full h-48 object-cover rounded">
                  <h3 class="font-bold mt-2">${art.title}</h3>
                  <p class="text-sm text-gray-600">${art.artist_display}</p>
                  <p class="text-xs text-gray-500">${art.date_display} - ${art.medium_display}</p>
                </div>
              `).join("")
            : "<p>No artworks found for this year.</p>";
        } catch (error) {
          console.error(error);
          gallery.innerHTML = "<p>There was an error retrieving data. Please try again.</p>";
        }
      });
    }

    const generateBtn = document.getElementById("generateInspiration");
    if (generateBtn) {
      generateBtn.addEventListener("click", async function () {
        const medium = document.getElementById("mediumFilter").value;
        const result = document.getElementById("inspirationResult");
        result.innerHTML = "<p>Finding inspiration...</p>";
        const query = medium ? `&q=${medium}` : "";
        try {
          const res = await fetch(`https://api.artic.edu/api/v1/artworks/search?page=1&limit=100${query}&fields=id,title,image_id`);
          const data = await res.json();
          const artworks = data.data;
          if (artworks.length === 0) {
            result.innerHTML = "<p>No artworks found.</p>";
            return;
          }
          const random = artworks[Math.floor(Math.random() * artworks.length)];
          result.innerHTML = `
            <div class="bg-white p-4 rounded shadow text-center">
              <img src="https://www.artic.edu/iiif/2/${random.image_id}/full/300,/0/default.jpg" class="mx-auto rounded mb-2" alt="${random.title}"/>
              <h3 class="font-bold">${random.title}</h3>
            </div>`;
        } catch (err) {
          console.error(err);
          result.innerHTML = "<p>Error retrieving artwork.</p>";
        }
      });
    }
  });





  const images = [
    'url("images/default.jpg")',
    'url("Images/default (1).jpg")',
    'url("Images/default (2).jpg")',
    'url("Images/default (3).jpg")'
  ];
  
  let index = 0;
  const background = document.getElementById("body");
  
  function changeBackground() {
    background.style.backgroundImage = images[index];
    index = (index + 1) % images.length; // Vuelve al principio cuando llega al final
  }
  
  changeBackground(); // Mostrar la primera imagen de inmediato
  setInterval(changeBackground, 4000); // Cambia cada 4 segundos