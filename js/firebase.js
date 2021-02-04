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
  console.log("Packs added Succesfully!");
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
