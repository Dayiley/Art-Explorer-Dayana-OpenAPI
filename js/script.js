
  //home Page
  
  const images = [
    'images/default.jpg',
    'images/default (1).jpg',
    'images/default (2).jpg',
    'images/default (3).jpg'
  ];
  
  let bgIndex = 0;
  const background = document.getElementById("body-home");

  function changeBackground() {
    if (!background) return; 
  background.style.backgroundImage = `url("${images[bgIndex]}")`;
  bgIndex = (bgIndex + 1) % images.length;
  }

  changeBackground();
  setInterval(changeBackground, 4000);

  const typingText = `This site uses the Art Institute of Chicago (ARTIC) API to showcase remarkable artworks and spark inspiration for artists seeking fresh ideas.
You'll also find a page where you can explore pieces by a specific year, try looking up artworks from your birth year!

I hope you enjoy exploring the art as much as I enjoyed building this site!`
  const typingDiv = document.getElementById("typing-intro");
  let typingIndex = 0;

  function type() {
    if (!typingDiv) return;
    if (typingIndex < typingText.length) {
      typingDiv.textContent += typingText.charAt(typingIndex);
      typingIndex++;
      setTimeout(type, 20);
    }
  }

  type();


  //year finished artwork fetch

const birthYearForm = document.getElementById("birthYearForm");
    if (birthYearForm) {
      birthYearForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const year = document.getElementById("birthYear").value;
        const gallery = document.getElementById("artGallery");
        gallery.innerHTML = "<p>Loading...</p>";

        const limit = 20;

        try {
          let res = await fetch(`https://api.artic.edu/api/v1/artworks/search?query[term][date_end]=${year}&fields=id,title,image_id,artist_display,date_display,medium_display&limit=${limit}`);             
          let data = await res.json();
          let artworks = data.data;

          if (artworks.length === 0) {
            res = await fetch(`https://api.artic.edu/api/v1/artworks/search?query[term][date_start]=${year}&fields=id,title,image_id,artist_display,date_display,medium_display`);
            data = await res.json();
            artworks = data.data;
          }

          
          console.log(artworks.length);
          console.log(res);
          
          
          
          gallery.innerHTML = artworks.length
            ? artworks.map(art => `
                <div class="card">
                  <img src="https://www.artic.edu/iiif/2/${art.image_id}/full/300,/0/default.jpg" alt="${art.title}" style="width:100%;max-height:200px;object-fit:cover;">
                  <h3>${art.title}</h3>
                  <p>${art.artist_display}</p>
                  <p>${art.date_display} - ${art.medium_display}</p>
                </div>
              `).join("")
            : "<p>No artworks found for this year.</p>";
        } catch (error) {
          console.error(error);
          gallery.innerHTML = "<p>Error retrieving artworks.</p>";
        }
      });
    }


    //generate choosing a medium
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
            <div >
              <img src="https://www.artic.edu/iiif/2/${random.image_id}/full/300,/0/default.jpg" alt="${random.title}" style="max-width:100%;border-radius:8px;">
              <h3>${random.title}</h3>
            </div>`;
        } catch (err) {
          console.error(err);
          result.innerHTML = "<p>Error retrieving artwork.</p>";
        }
      });
    };

