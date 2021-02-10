async function createGrid() {
  var userPacks = await getPacks("creator", "leif");
  if (userPacks) {
    for (let pack of userPacks) {
      $("#pack-feed").append(`
          <div class="starterset">
            <div class="image-container"></div>
            <div class="preview-text-container">
              <div class="pack-title">
                <h1 style="font-size: 23">${pack["name"]}</h1>
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
  window.addEventListener("load", function () {
    console.log("glider selected");
    new Glider(document.querySelector(".glider"), {
      slidesToShow: 5,
      slidesToScroll: 5,
      draggable: true,
      arrows: {
        prev: ".glider-prev",
        next: ".glider-next",
      },
    });
  });
}

async function addPacksToGlider(category) {
  var packs = await getPacks("category", category);
  if (packs) {
    for (let pack in packs) {
      $("#glider").append(
        '<div style="width: 100px; height: 100px; background-color: green;" ></div>'
      );
      var glider = document.getElementById("glider");
    }
  }
}
