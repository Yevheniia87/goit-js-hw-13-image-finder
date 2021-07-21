import './sass/main.scss';
import getRefs from './js/refs.js';
import photoCardTpl from './templates/cards.hbs';
import NewsApiService from './js/apiService.js';
import LoadMoreBtn from './js/loadMoreBtn.js';

import { info, error } from '@pnotify/core';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';


const refs = getRefs();

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});
const newsApiService = new NewsApiService();


refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchCards);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
refs.galleryCards.addEventListener('click', onOpenModal);

function onSearch(e) {
    e.preventDefault();
    // clearHitsContainer();
    //  без get and set вместо query будет searchQuery.
    newsApiService.query = e.currentTarget.elements.query.value;
    
    if (newsApiService.query === '') {
        return info({
            text: 'Enter the value!',
            delay: 1500,
            closerHover: true,
        });
    }
    
    loadMoreBtn.show();
    newsApiService.resetPage();
     clearHitsContainer();
    fetchCards();  
}
// function onLoadMore() {
//     // loadMoreBtn.disabled();
//     // newsApiService.fetchCards().then(hits => {
//     //     appendHitsMarkup(hits);
//     //     loadMoreBtn.enable();
//     // });
//     fetchHits(); 
// }
function fetchCards() {
    loadMoreBtn.disabled();
    return newsApiService.fetchCards().then(hits => {
        appendHitsMarkup(hits);
        loadMoreBtn.enable();
        if (hits.length === 0) {
            loadMoreBtn.hide();
            error({
                text: 'No matches found!',
                delay: 1500,
                closerHover: true,
            });
        }
        // const onLoadMore = document.getElementById('search-gallery');
        //     onLoadMore.scrollIntoView({  
        //         behavior: 'smooth',
        //         block: 'end',
        //     });
    });    
}
function appendHitsMarkup(hits) {
    refs.galleryCards.insertAdjacentHTML('beforeend', photoCardTpl(hits));
}
function clearHitsContainer() {
    refs.galleryCards.innerHTML = '';
}
function onOpenModal(e) {
    if (e.target.nodeName !== 'IMG') {
        return;
    }
      const largeImageURL = `<img src= "${e.target.dataset.sourse}" alt = "" >`;
    basicLightbox.create(largeImageURL).show();
}

//scroll with button

// function onLoadMore() {
//     fetchCards().then(setTimeout(() => {
//         window.scrollTo({
//             top: document.documentElement.offsetHeight,
//             behavior: 'smooth',
//             block: 'end'
//         });
//     }, 1000),
//     ).catch(error => console.log(error));
// }

//avtoscroll

let last_known_scroll_position = 0;
let ticking = false;
function onLoadMore() {
      fetchCards().then(setTimeout(() => {
        window.scrollTo({
            behavior: 'smooth',
            block: 'end'
        });
    }, 1000),
    ).catch(error => console.log(error));
};
window.addEventListener('scroll', function (e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function () {
            onLoadMore(last_known_scroll_position);
            ticking = false;
        });
        ticking = true;
    }
});
