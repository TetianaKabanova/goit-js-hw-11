import axios from 'axios';

export default class PixabayAPI {
  static URL = 'https://pixabay.com/api/';
  static API_KEY = '35851703-1327ea85a263036dc5c6068c0';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.hits = 0;
    this.totalHits = 0;
    this.per_page = 40;
    this.totalPages = 0;
  }

  async getPhotos() {
    const url = `${PixabayAPI.URL}?key=${PixabayAPI.API_KEY}&q=${this.searchQuery}&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`;

    const response = await axios.get(url);
    const data = await response.data;
    this.incrementPage();
    return data;
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
}
