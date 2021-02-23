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

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
    window.location.href = "../pages/feed.html";
  }
}

async function login() {
  resetError();
  firebase
    .auth()
    .signInWithEmailAndPassword($("#email").val(), $("#passwort").val())
    .then((userCredential) => {
      console.log("Signed in succesfully!");
      window.location.href = "../pages/feed";
    })
    .catch(function (error) {
      console.log("Error logging in: ", error);
      errorOutput(error.message, error.code);
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
  var onClickLocation = 'starterset.html';
  if(editor) { var save = selector; selector = null; };
  var packs = await getPacksByCategory(selector, verified, user);
  if(editor) { 
    selector = save;
    onClickLocation = 'edit-pack.html';
  }
  if (packs) {   
      for (let pack of packs) {
          $(`.sw-${selector}`).append(`
              <div class="starterset swiper-slide" onclick="{window.location.href = '${onClickLocation}?${pack['clean_name']}'}">
                  <div class="image-container" style="background-image: url('${pack['cover_image']}');"></div>
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
  if($("body").attr("class") == "restricted editor") {
    initEditorSwipers();
  } else {
    for(let category of categories) {
      initSwiperBySelector(category);
    }
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


  if(rank='admin') {
    addSwiperStructure('global-unverified-pack-swiper', 'Alle Unverifizierte Startersets');
    await addBySelector('global-unverified-pack-swiper', false, false, true);
    initSwiperBySelector('global-unverified-pack-swiper');

    addSwiperStructure('global-verified-pack-swiper', 'Alle Verifizierte Startersets');
    await addBySelector('global-verified-pack-swiper', true, false, true);
    initSwiperBySelector('global-verified-pack-swiper');
  }
}

async function initEditorSwipers() {
  initSwiperBySelector('user-unverified-pack-swiper');
  initSwiperBySelector('user-verified-pack-swiper');
  initSwiperBySelector('global-unverified-pack-swiper');
  initSwiperBySelector('global-verified-pack-swiper');
}

//#############################Show Pack#########################//

async function getParam() {
  var withQuestionMark = window.location.search;
  var packName = withQuestionMark.substring(1);
  var pack = await getPackByName(packName);
  return pack;
}

async function addContent() {
  var pack = await getParam();
  $('#pack-title').text(pack['name']);
  $('#pack-description').text(pack['description']);
  $('#main-set').append(pack['htmlContent']);
  $("#pack-image").attr("src", `${pack['cover_image']}`);
}

async function fillData() {
  var params = window.location.search;
  if(params) {
    var pack = await getParam();
    $('#title').val(pack['name']);
    $('#description').val(pack['description']);
    quill.setContents(pack['content']);
    for(category of pack['categories']) {
      toggleButton(category);
    }
    $('#submit-pack').attr('onmousedown', `{updatePack('${pack['id']}')}`);
    $("#cover-image-display").attr("src", `${pack['cover_image']}`);
    $('#remove-image').toggleClass('hidden');
    $('#cover-button').toggleClass('hidden');
  }
}

async function removeImage() {
  $('#remove-image').toggleClass('hidden');
  $('#cover-button').toggleClass('hidden');

}

function entrySuccess() {
  $('#show-success').fadeIn('slow');
  window.setTimeout(function(){
    window.location.href = 'editor.html';  
  }, 2000);
}