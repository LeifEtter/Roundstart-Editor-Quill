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

let categories = [
  "Gesundheit",
  "Finanzen",
  "Beruf",
  "Versicherung",
  "Wohnen",
  "Ernährung",
];

async function addPacks() {
  var creatorId = sessionStorage.getItem("local_uid");
  var name = "Pack ";
  var creator = "leif";
  var description = "Test Beschreibung";
  var category = "essen";
  var verified = true;

  for (let i = 0; i < 10; i++) {
    let packName = name + i;
    packs
      .doc()
      .set({
        name: packName,
        creator: creator,
        description: description,
        category: category,
        verified: verified,
        creator_id: creatorId,
      })
      .catch(function (error) {
        console.log("Error adding documents: ", error);
      });
  }
  console.log("Packs added succesfully!");
}

async function addPack() {
  var categories = [];
  console.log($(".activated").id);
  $(".activated").each(function () {
    categories.push($(this).attr("id"));
  });
  var creatorId = sessionStorage.getItem("local_uid");
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var creator = document.getElementById("creator").value;
  let content = quill.getContents().ops;
  let htmlContent = quill.root.innerHTML;

  packs
    .doc()
    .set({
      name: title,
      creator: creator,
      description: description,
      content: content,
      categories: categories,
      htmlContent: htmlContent,
      creator_id: creatorId,
      verified: true,
    })
    .catch(function (error) {
      console.log("Error adding documents: ", error);
    });

  console.log("Pack added succesfully!");
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

async function getUserRank() {
  uid = sessionStorage.getItem("local_uid");
  const snapshot = await db.collection("users").doc(uid).get();
  const data = snapshot.data();
  return data["rank"];
}

async function getPacks(attribute, value, verified, user) {
  var docs = [];
  var query = await packs
    .where(attribute, "==", value)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (verified && doc.data()["verified"]) {
          if (user) {
            if (doc()["creator_id"]) {
              docs.push(doc.data());
            }
          } else {
            docs.push(doc.data());
          }
        } else if (!verified) {
          if (user) {
            if (doc()["creator_id"]) {
              docs.push(doc.data());
            }
          } else {
            docs.push(doc.data());
          }
        }
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  if (!docs.length == 0) {
    console.log(`${docs.length} documents found`);
    return docs;
  } else {
    console.log("No Document found");
    return null;
  }
}

async function getPacksByCategory(category, verified, user) {
  var docs = [];
  var query = await packs
    .where("categories", "array-contains", category)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log('found doc');
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
        } else {
          docs.push(doc);
        }
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  if (!docs.length == 0) {
    console.log(`${docs.length} documents found for ${category}`);
    return docs;
  } else {
    console.log("No Document found");
    return null;
  }
}
