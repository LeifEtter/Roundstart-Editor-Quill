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

function initSwiperCat(category) {
    var swiper = new Swiper(`.sc-${category}`, {
        slidesPerView: 4,
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
    var packs = await getPacksByCategory(category, false, false);
    if (packs) {   
        for (let pack of packs) {
            $(".swiper-wrapper").append(`
                <div class="starterset swiper-slide">
                    <div class="image-container"></div>
                    <div class="preview-text-container">
                        <div class="pack-title">
                            <h1 style="font-size: 23">${pack['name']}</h1>
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

async function addByCat(category) {
    var packs = await getPacksByCategory(category, false, false);
    if (packs) {   
        for (let pack of packs) {
            console.log(pack['name']);
            $(`.sw-${category}`).append(`
                <div class="starterset swiper-slide">
                    <div class="image-container"></div>
                    <div class="preview-text-container">
                        <div class="pack-title">
                            <h1 style="font-size: 23">${pack['name']}</h1>
                        </div>
                        <div class="pack-description">
                            <p>testDescription</p>
                        </div>
                    </div>
                </div> 
            `);
        }
    }
}

async function addSwipers() {
    for(let category of categories) {
        $('body').append(`
            <div class="pack-swiper">
                <div class="swiper-container sc-${category}">
                    <div class="swiper-wrapper sw-${category}">
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
        `);
        await addByCat(category);
        initSwiperCat(category);
    }

}
