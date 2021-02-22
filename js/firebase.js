var firebaseConfig = {
  apiKey: "AIzaSyDeIm_5lkHt-avad9R9HU9ZUpNNMVWDs-A",
  authDomain: "roundstart-test-db.firebaseapp.com",
  projectId: "roundstart-test-db",
  storageBucket: "roundstart-test-db.appspot.com",
  messagingSenderId: "774952792499",
  appId: "1:774952792499:web:5d23cccaf52370e61b5bc6",
  measurementId: "G-S0Y7N1XSR0",
};

let app = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore(app);
let packs = db.collection("packs");
let users = db.collection("users");

console.log(sessionStorage.getItem('local_uid'));

async function savePhoto() {
  var submitterID = sessionStorage.getItem("local_uid");
  var data = new FormData();
  let photo = document.getElementById("cover-image").files[0];
  var blob = photo.slice(0, photo.size, "image/png");
  var filename = document.getElementById("cover-image").value;
  var filename = filename.split(".").slice(0, -1).join(".");
  var filenamefull = filename + "-user-" + submitterID.toString();
  var newFile = new File([blob], filenamefull + ".jpg", { type: "image/png" });
  data.append("cover-image", newFile);

  $.ajax({
    url: "../upload.php",
    data: data,
    type: "POST",
    processData: false,
    contentType: false,
    success: function () {
      console.log("Success!");
    },
  });
}  

async function addPack() {
  /*await savePhoto();*/
  var categories = [];
  $(".activated").each(function () {
    categories.push($(this).attr("id"));
  });
  var creatorId = sessionStorage.getItem("local_uid");
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  let content = quill.getContents().ops;
  let htmlContent = quill.root.innerHTML;

  var cleanName = title.replace(/\s/g, '-');
  cleanName = cleanName.replace('ä', 'ae')
  cleanName = cleanName.replace('ü', 'ue')
  cleanName = cleanName.replace('ö', 'oe')
  cleanName = cleanName.replace('ß', 'ss')
  cleanName = cleanName.replace('Ä', 'Ae')
  cleanName = cleanName.replace('Ü', 'Ue')
  cleanName = cleanName.replace('Ö', 'Oe')
  cleanName = cleanName.replace("'", "")
  cleanName = cleanName.replace("&", "und")
  console.log(cleanName);

  /*var filename = document.getElementById("cover-image").value;
  var filename = filename.split(".").slice(0, -1).join(".");
  var filename = filename.replace(/^.*[\\\/]/, "");
  var cover_image = filename + "-user-" + creatorId.toString();*/

  packs
    .doc()
    .set({
      name: title,
      creator: "template",
      description: description,
      content: content,
      categories: categories,
      htmlContent: htmlContent,
      creator_id: creatorId,
      verified: false,
      cover_image: 'tesla.jpg',
      clean_name: cleanName
    })
    .catch(function (error) {
      console.log("Error adding documents: ", error);
    });

  console.log("Pack added succesfully!");
}

async function getUserRank() {
  uid = sessionStorage.getItem("local_uid");
  const snapshot = await db.collection("users").doc(uid).get();
  const data = snapshot.data();
  return data["rank"];
}

async function getPackByName(name){
  var doc;
  var query = await db.collection('packs')
    .where('clean_name', '==', name)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (document) {
        doc = document.data();
      })
    })
  console.log(doc['creator']);
  return doc;
}

async function getPackByID(id){
  const snapshot = await db.collection("packs").doc(id).get();
  const data = snapshot();
  return data;
}

async function getPacksByCategory(category, verified, user) {
  var attribute = 'categories';
  var comparer = 'array-contains';
  var docs = [];
  if(!category) {
    attribute = 'public';
    category = true;
    comparer = '==';
  }
  var query = await packs
    .where(attribute, comparer, category)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc = doc.data();
        if (verified && !user) {
          doc["verified"] == true ? docs.push(doc) : null;
        } else if (!verified && user) {
          doc["creator_id"] == sessionStorage.getItem("local_uid")
            ? docs.push(doc)
            : null;
        } else if (verified && user) {
          
          if (
            doc["verified"] == true &&
            doc["creator_id"] == sessionStorage.getItem("local_uid")
          ) {
            docs.push(doc);
          }
        } else if(!verified && !user){
          if(doc['verified'] == false) {
            docs.push(doc);
          }
        } else {
          docs.push(doc);
        }
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  if (!docs.length == 0) {
    return docs;
  } else {
    return null;
  }
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