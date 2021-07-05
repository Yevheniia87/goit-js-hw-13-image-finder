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
loadMoreBtn.refs.button.addEventListener('click', fetchCards);
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
    });
    
};


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
      const largeImageURL = `<img src= ${e.target.dataset.source}>`;
  basicLightbox.create(largeImageURL).show();
}

