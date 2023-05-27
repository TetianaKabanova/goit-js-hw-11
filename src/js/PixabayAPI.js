import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '35851703-1327ea85a263036dc5c6068c0';

export default class PixabayAPI {
  constructor(totalHits = 0) {
    this.key = API_KEY;
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalPages = 0;
    this.totalHits = totalHits;
  }

  async getPhotos() {
    const { data } = await axios.get(
      `${URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );

    this.incrementPage();
    return data;
  }

  incrementPage() {
    return (this.page += 1);
  }

  resetPage() {
    this.page = 1;
    this.totalPages = 0;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  countTotalPages(totalHits) {
    return (this.totalPages = Math.ceil(totalHits / this.per_page));
  }
}
