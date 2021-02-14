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

/*async function savePhoto() {
    let photo = document.getElementById("cover-image").files[0];
    let formData = new FormData();     
         
    formData.append("photo", photo); 
    
    try {
       let r = await fetch('/upload/image', {method: "POST", body: formData}); 
       console.log('HTTP response code:',r.status); 
    } catch(e) {
       console.log('Huston we have problem...:', e);
    }
}*/


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
  /*await savePhoto();*/ 
  var categories = [];
  console.log($(".activated").id);
  $(".activated").each(function () {
    categories.push($(this).attr("id"));
  });
  var creatorId = sessionStorage.getItem("local_uid");
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  let content = quill.getContents().ops;
  let htmlContent = quill.root.innerHTML;

  packs
    .doc()
    .set({
      name: title,
      creator: 'template',
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

async function getPacksByCategory(category, verified, user) {
  var docs = [];
  !category ? category = categories : null;
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
