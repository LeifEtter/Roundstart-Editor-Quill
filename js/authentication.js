
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    sessionStorage.setItem('local_uid', user.uid);
    console.log("User is signed!");
  } else {
    console.log("User is signed out!")
  }
});


async function addUser(id) {
  console.log('adding User to DB');
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  await users.doc(id).set({
    name: name,
    email: email,
    rank: "user",
    profile_img: 'profile.jpg',
  })
  .then(() => {
    console.log("entered sucessfully");
  })
  .catch(function (error) {
    console.log("Error Creating User: ", error);
  });
}

function checkLogin() {
  if(sessionStorage.getItem("local_uid") == undefined) {
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
  var user;
  resetError();
  var email = document.getElementById("email").value;
  var password = document.getElementById("passwort").value;

  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      user = userCredential.user;
      console.log("Registered Sucessfully");
      success = true;
      console.log(success + 'd');
    })
    .catch(function (error) {
      console.log("Error Creating User: ", error);
      var errorCode = error.code;
      var errorMessage = error.message;
      errorOutput(errorMessage, errorCode);
    });
  console.log(success);
  if(success == true) {
    await addUser(user.uid);
    window.location.href = "../pages/user-info.html";
  }
}

async function login() {
  resetError();
  var email = document.getElementById("email").value;
  var password = document.getElementById("passwort").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log(userCredential.uid);
      console.log("Signed in succesfully!");
      window.location.href = "../pages/user-info.html";
    })
    .catch(function (error) {
      console.log("Error logging in: ", error);
      var errorCode = error.code;
      var errorMessage = error.message;
      errorOutput(errorMessage, errorCode);
    });
}



function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      sessionStorage.setItem('local_uid', null);
      window.location.href = "../pages/login.html";
    })
    .catch(function (error) {
      console.log("Error singing out: ", error);
    });
    sessionStorage.setItem('local_uid', null);
}

async function getProfileData() {
  var uid = sessionStorage.getItem('local_uid');
  const snapshot = await db.collection('users').doc(uid).get();
  const data = snapshot.data()
  if(data == undefined) {
    return null;
  } else {
    return data;
  }
}

async function setProfileData() {
  var profileData = await getProfileData();
  if(profileData) {
    /*$('#profile-icon').attr("src", `../profile-images/${profileData[0]}`);*/
    $('#profile-name').text(`${profileData['name']}`);
    $('#profile-image-container').append(`
      <img class="profile-icon" id="profile-icon" src="../profile-images/${profileData['profile_img']}"></img>
    `);
    $('#dropdown-show-container').toggleClass('hidden');
    $('#login-register-links').toggleClass('hidden');

    if(profileData['rank'] != 'user') {
      $('#editor-access').toggleClass('hidden');
      $('#upgrade-access').toggleClass('hidden');
    }
  }
}


async function addAccountData() {
    var accountData = await getProfileData();
    if(accountData) {
      $('#display-name').text(`${accountData['name']}`);

      let rankUpperCase = accountData['rank'].charAt(0).toUpperCase() + accountData['rank'].slice(1);
      $('#display-rank').text(rankUpperCase);
      $('#display-email').text(`${accountData['email']}`);
    }
}