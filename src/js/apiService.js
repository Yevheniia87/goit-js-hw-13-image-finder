export default class NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        //this.perPage = 12;
    }
    fetchCards() {
        const API_KEY = '22317274-5f5939ff79d612c3aacb02224';
        const BASE_URL = 'https://pixabay.com/api/';
        return fetch(
            `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`,
        ).then(response => response.json()).then(({hits}) => {
            this.incrementPage();
            
            return hits;
        });
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
         this.searchQuery = newQuery;
    }
};
