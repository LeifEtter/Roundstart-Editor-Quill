$(function () {
  $("#nav-placeholder").load("nav.html");
});

window.onload = function () {
  if ($("body").attr("class") == "restricted") {
    if (!checkLogin()) {
      window.location = "../pages/login.html";
    }
  }
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    sessionStorage.setItem("local_uid", user.uid);
    console.log("User is signed!");
  } else {
    console.log("User is signed out!");
  }
});

//#####################Editor###############################//

//Category Buttons

function toggleButton(category) {
  $(`#${category}`).toggleClass("activated");
}

function generateCategories() {
  console.log("Generating categories!");
  for (let category of categories) {
    $("#category-button-container").append(`
            <button class="category-button" id="${category}" onClick="toggleButton('${category}')">${category}
            </button>
        `);
  }
}

//------------------------------------------------------------//

//Display Uploaded Image

$("#cover-image").change(function () {
  if (this.files && this.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#cover-image-display").attr("src", e.target.result);
    };
    reader.readAsDataURL(this.files[0]);
  }
});

//#####################Authentication###############################//

async function addUser(id) {
  await users
    .doc(id)
    .set({
      name: $("#name").val(),
      email: $("#email").val(),
      rank: "user",
      profile_img: "profile.jpg",
    })
    .then(() => {
      console.log("entered sucessfully");
    })
    .catch(function (error) {
      console.log("Error Creating User: ", error);
    });
}

function checkLogin() {
  if (!sessionStorage.getItem("local_uid")) {
    return false;
  } else {
    return true;
  }
}

function errorOutput(errorMessage, errorCode) {
  if (errorCode.includes("email")) {
    $("#email").css("box-shadow", "inset 0 0 4px red");
  } else if (errorCode.includes("password")) {
    $("#passwort").css("box-shadow", "inset 0 0 4px red");
  }
  $("#error-message").html(errorMessage);
}

function resetError() {
  $("#email").css("box-shadow", "rgba(0, 0, 0, 0.16) 0px 1px 4px");
  $("#passwort").css("box-shadow", "rgba(0, 0, 0, 0.16) 0px 1px 4px");
  $("#error-message").text("");
}

async function register() {
  var success = false;
  resetError();

  await firebase
    .auth()
    .createUserWithEmailAndPassword($("#email").val(), $("#passwort").val())
    .then((userCredential) => {
      var user = userCredential.user;
      console.log("Registered Sucessfully");
      success = true;
    })
    .catch(function (error) {
      console.log("Error Creating User: ", error);
      errorOutput(error.message, error.code);
    });
  if (success == true) {
    await addUser(user.uid);
    window.location.href = "../pages/user-info.html";
  }
}

async function login() {
  resetError();
  firebase
    .auth()
    .signInWithEmailAndPassword($("#email").val(), $("#passwort").val())
    .then((userCredential) => {
      console.log("Signed in succesfully!");
      window.location.href = "../pages/user-info.html";
    })
    .catch(function (error) {
      console.log("Error logging in: ", error);
      errorOutput(errorMessage, errorCode);
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      sessionStorage.setItem("local_uid", null);
      window.location.href = "../pages/login.html";
    })
    .catch(function (error) {
      console.log("Error singing out: ", error);
    });
  sessionStorage.setItem("local_uid", null);
}

async function getProfileData() {
  var uid = sessionStorage.getItem("local_uid");
  const snapshot = await users.doc(uid).get();
  const data = snapshot.data();
  if (!data) {
    return null;
  } else {
    return data;
  }
}

async function setProfileData() {
  var profileData = await getProfileData();
  if (profileData) {
    $("#profile-name").text(`${profileData["name"]}`);
    $("#profile-image-container").append(`
        <img class="profile-icon round-style" id="profile-icon" src="../img/profile/${profileData["profile_img"]}"></img>
      `);
    $("#dropdown-show-container").toggleClass("hidden");
    $("#login-register-links").toggleClass("hidden");

    if (profileData["rank"] != "user") {
      $("#editor-access").toggleClass("hidden");
      $("#upgrade-access").toggleClass("hidden");
    }
  }
}

async function addAccountData() {
  var accountData = await getProfileData();
  if (accountData) {
    $("#display-name").text(`${accountData["name"]}`);
    let rankUpperCase =
      accountData["rank"].charAt(0).toUpperCase() +
      accountData["rank"].slice(1);
    $("#display-rank").text(rankUpperCase);
    $("#display-email").text(`${accountData["email"]}`);
  }
}

//########################Swiper###############################//

function updateViewport() {
  screenWidth = $(window).width();
  setElementsPerView();
  reinitSwipers();
}

function setElementsPerView() {
  if(screenWidth > 1550) {
      elementsPerView = 6;
  } else if(screenWidth > 1200) {
      elementsPerView = 5;
  } else if(screenWidth > 900) {
      elementsPerView = 4;
  } else if(screenWidth > 700) {
      elementsPerView = 3;
  } else {
      elementsPerView = 2;
  }
}

function initSwiperBySelector(selector) {
  var pointer;
  selector ? pointer = `.sc-${selector}` : pointer = '.swiper-container';
  var swiper = new Swiper(`.sc-${selector}`, {
      slidesPerView: elementsPerView,
      spaceBetween: 10,
      slidesPerGroup: 4,
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });
}

async function addBySelector(selector, verified, user, editor) {
  if(editor) { var save = selector; selector = null; };
  var packs = await getPacksByCategory(selector, verified, user);
  if(editor) { selector = save};
  if (packs) {   
      for (let pack of packs) {
          $(`.sw-${selector}`).append(`
              <div class="starterset swiper-slide">
                  <div class="image-container" style="background-image: url('../../img/covers/${pack['cover_image']}');"></div>
                  <div class="preview-text-container">
                      <div class="pack-title">
                          <h1>${pack['name']}</h1>
                      </div>
                      <div class="pack-description">
                          <p>${pack['description']}</p>
                      </div>
                  </div>
              </div> 
          `);
      }
  }
}

function addSwiperStructure(selector, title) {
  !title ? title = selector : null;
  $('body').append(`
          <h1 class="category-title">${title}</h1>
          <div class="pack-swiper">
              <div class="swiper-container sc-${selector}">
                  <div class="swiper-wrapper sw-${selector}">
                  </div>
                  <div class="swiper-button-next"></div>
                  <div class="swiper-button-prev"></div>
              </div>
          </div>
          <div class="swiper-seperator"></div>
      `);
}

async function addSwipers() {
  for(let category of categories) {
      addSwiperStructure(category);
      await addBySelector(category, true, false);
      initSwiperBySelector(category);
  }
}

async function reinitSwipers() {
  for(let category of categories) {
      initSwiperBySelector(category);
  }
}

async function addPacksByRank() {
  var profileData = await getProfileData();
  var rank = profileData['rank'];

  addSwiperStructure('user-unverified-pack-swiper', 'Deine Unverifizierten Startersets');
  await addBySelector('user-unverified-pack-swiper', false, true, true);
  initSwiperBySelector('user-unverified-pack-swiper');

  addSwiperStructure('user-verified-pack-swiper', 'Deine Verifizierten Startersets');
  await addBySelector('user-verified-pack-swiper', true, true, true);
  initSwiperBySelector('user-verified-pack-swiper');

  addSwiperStructure('global-unverified-pack-swiper', 'Alle Unverifizierte Startersets');
  await addBySelector('global-unverified-pack-swiper', false, false, true);
  initSwiperBySelector('global-unverified-pack-swiper');

  addSwiperStructure('global-verified-pack-swiper', 'Alle Verifizierte Startersets');
  await addBySelector('global-verified-pack-swiper', true, false, true);
  initSwiperBySelector('global-verified-pack-swiper');

}