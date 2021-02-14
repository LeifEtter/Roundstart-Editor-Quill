let categoryButtons = ['Gesundheit', 'Finanzen', 'Beruf', 'Versicherung', 'Wohnen', 'Ernährung'];

function toggleButton(category) {
    var classList = document.getElementById(`${category}`).className.split(/\s+/);
    $(`#${category}`).toggleClass("activated");
}

function generateCategories() {
    console.log('Generating categories!');
    for(let category of categoryButtons) {
        $('#category-button-container').append(`
            <button class="category-button" id="${category}" onClick="toggleButton('${category}')">${category}
            </button>
        `);
    }
}

function displayImage(input) {
    if(input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#cover-image-display').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$('#cover-image').change(function() {
    displayImage(this);
});
