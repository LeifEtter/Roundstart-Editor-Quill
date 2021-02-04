async function createGrid() {
    var userPacks = await getPacksByUser("Leif");
    if (userPacks) {
      for (let pack of userPacks) {
        $("#pack-feed").append(`
          <div class="starterset">
            <div class="image-container"></div>
            <div class="preview-text-container">
              <div class="pack-title">
                <h1 style="font-size: 23">${pack['name']}</h1>
              </div>
              <div class="pack-description">
                <p>testDescription</p>
              </div>
            </div>
          </div> 
        `);
      }
    } else {
      console.log("No packs can be displayed");
    }
}

function addListenerGlider() {
  window.addEventListener('load', function(){
      new Glider(document.querySelector('.glider'), {
          slidesToShow: 5,
          slidesToScroll: 5,
          draggable: true,
          arrows: {
              prev: '.glider-prev',
              next: '.glider-next'
          }
      })
  })
}