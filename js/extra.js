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

  async function deletePacksByCreator(creator) {
    var query = await packs
      .where("creator_id", "==", creator)
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