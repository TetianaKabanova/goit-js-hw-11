import axios from 'axios';
import { KEY } from './api-key';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';

  #query = '';

  constructor() {
    this.page = 1;
    this.per_page = 40;
  }

  fetchPhotosByQuery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        q: this.#query,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: ' true',
        key: KEY,
      },
    });
  }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }
}
