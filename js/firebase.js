var firebaseConfig = {
  apiKey: "AIzaSyDeIm_5lkHt-avad9R9HU9ZUpNNMVWDs-A",
  authDomain: "roundstart-test-db.firebaseapp.com",
  projectId: "roundstart-test-db",
  storageBucket: "roundstart-test-db.appspot.com",
  messagingSenderId: "774952792499",
  appId: "1:774952792499:web:5d23cccaf52370e61b5bc6",
  measurementId: "G-S0Y7N1XSR0"
};

let app = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore(app);
let packs = db.collection('packs');
let users = db.collection('users');

async function getPacksByUser(userID) {
    var docs = [];
    var query = await packs
      .where("creator", "==", userID)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          docs.push(doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    
    if (!docs.length == 0) {
      console.log(`${docs.length} documents found`);
      return docs;
    } else {
      console.log("No Document found")
      return null;
    }
}

async function getPacksByCategory(category) {
    var docs = [];
    var query = await packs
      .where("category", "==", category)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          docs.push(doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    
    if (!docs.length == 0) {
      console.log(`${docs.length} documents found`);
      return docs;
    } else {
      console.log("No Document found")
      return null;
    }
}

async function addPacks() {
  var name = "Pack ";
  var creator = "leif";
  var description = "Test Beschreibung";
  var category = "essen";

  for(let i = 0; i<10; i++) {
      let packName = name + i;
      packs.doc().set({
          name: packName,
          creator: creator,
          description: description,
          category: category,
      })
      .catch(function (error) {
        console.log("Error adding documents: ", error);
      });
      
  }
  console.log("Packs added succesfully!");
}

async function addPack() {
  var title = document.getElementById('title').value;
  var description = document.getElementById('description').value;
  var creator = document.getElementById('creator').value;
  let content = quill.getContents().ops;
  let htmlContent = quill.root.innerHTML;
  
  packs.doc().set({
    name: title,
    creator: creator,
    description: description,
    content: content,
    category: 'default',
    htmlContent: htmlContent
  })
  .catch(function (error) {
    console.log("Error adding documents: ", error);
  });

  console.log("Pack added succesfully!")
}

async function deletePacksByCreator(creator) {
  var query = await packs
      .where("creator", "==", creator)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      })
      .catch(function (error) {
        console.log("Error deleting documents: ", error);
      });
}
async function addUser() {
  var name = document.getElementById("name").value;
  users.doc().set({
    name: name,
    rank: 'user',
  })
}
function errorOutput(errorMessage, errorCode) {
  

  if(errorCode.includes('email')) {
    $('#email').css("box-shadow", "inset 0 0 4px red");
  } else if(errorCode.includes('password')) {
    $('#passwort').css("box-shadow", "inset 0 0 4px red");
  }
  $('#error-message').html(errorMessage);
}

function resetError() {
  $('#email').css("box-shadow", "rgba(0, 0, 0, 0.16) 0px 1px 4px");
  $('#passwort').css("box-shadow", "rgba(0, 0, 0, 0.16) 0px 1px 4px");
  $('#error-message').text('');
}

async function register() {
  resetError();
  var email = document.getElementById("email").value;
  var password = document.getElementById("passwort").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Registered Sucessfully");
      var user = userCredential.user;
      addUser();
    })
    .catch(function (error) {
      console.log("Error Creating User: ", error);
      var errorCode = error.code;
      var errorMessage = error.message;
      errorOutput(errorMessage, errorCode);
    });
  
  
}