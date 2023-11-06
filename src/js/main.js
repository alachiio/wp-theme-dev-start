import barba from '@barba/core';
import jQuery from 'jquery';

window.$ = jQuery;

const interactSettings = {
    root: document.querySelector('.center'),
    rootMargin: '0px 0px 200px 0px'
};

let observer = new IntersectionObserver(onIntersection, interactSettings);

function onIntersection(imageEntites) {
    imageEntites.forEach(image => {
        if (image.isIntersecting) {
            observer.unobserve(image.target);
            image.target.src = image.target.dataset.src;
            image.target.onload = () => image.target.classList.add('loaded');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy-image"));
    let active = false;

    const lazyLoad = function () {
        if (active === false) {
            active = true;

            setTimeout(function () {
                lazyImages.forEach(function (lazyImage) {
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add("loaded");

                        lazyImages = lazyImages.filter(function (image) {
                            return image !== lazyImage;
                        });

                        if (lazyImages.length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                            window.removeEventListener("orientationchange", lazyLoad);
                        }
                    }
                });

                active = false;
            }, 200);
        }
    };

    window.onload = lazyLoad;
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
});

(function ($) {
    "use strict";

    /*---background image---*/
    function dataBackgroundImage() {
        $('[data-bgimg]').each(function () {
            var bgImgUrl = $(this).data('bgimg');
            $(this).css({
                'background-image': 'url(' + bgImgUrl + ')', // + meaning concat
            });
            $(this).removeAttr('data-bgimg');
        });
    }

    $(window).on('load', function () {
        dataBackgroundImage();
    });

})(jQuery);

barba.init({
    transitions: [{
        name: 'default-transition',
        leave({ current, next, trigger }) {
            const done = this.async();
            done();
        }
    }]
});


