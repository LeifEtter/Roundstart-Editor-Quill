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

async function reinitSwipers() {
    for(let category of categories) {
        initSwiperCat(category);
    }
}