function updateViewport() {
    screenWidth = $(window).width();
    setElementsPerView();
    initSwiper();
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

function initSwiper() {
    var swiper = new Swiper('.swiper-container', {
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

async function addPacksToSwiper(category) {
    var packs = await getPacks("category", category, true);
    if (packs) {
        for (let pack in packs) {
            $(".swiper-wrapper").append(`
                <div class="starterset swiper-slide">
                    <div class="image-container"></div>
                    <div class="preview-text-container">
                        <div class="pack-title">
                            <h1 style="font-size: 23">pack</h1>
                        </div>
                        <div class="pack-description">
                            <p>testDescription</p>
                        </div>
                    </div>
                </div> 
            `);
        }
    }
    initSwiper();
}

