import axios from 'axios';

export default class PixabayAPI {
  static URL = 'https://pixabay.com/api/';
  static API_KEY = '35851703-1327ea85a263036dc5c6068c0';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getPhotos() {
    const url = `${PixabayAPI.URL}?key=${PixabayAPI.API_KEY}&q=${this.searchQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`;

    const { data } = await axios.get(url);

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
