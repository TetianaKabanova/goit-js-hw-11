import axios from 'axios';

export default class PixabayAPI {
  static URL = 'https://pixabay.com/api/';
  static API_KEY = '35851703-1327ea85a263036dc5c6068c0';
  constructor(totalHits = 0) {
    this.page = 1;
    this.searchQuery = '';
    this.totalPages = 0;
    this.totalHits = totalHits;
  }

  async getPhotos() {
    const params = {
      page: this.page,
      q: this.query,
      per_page: this.per_page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };
    const url = `${PixabayAPI.URL}?key=${PixabayAPI.API_KEY}&q=${this.searchQuery}&per_page=40&page=${this.page}`;
    const { data } = await axios.get(url, { params });

    this.incrementPage();

    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.totalPages = 0;
  }

  get guery() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  setTotal(totalHits) {
    this.totalPages = totalHits;
  }

//   countTotalPages(totalHits) {
//     return (this.totalPages = Math.ceil(totalHits / this.per_page));
//   }
// }

//   async getPhotos() {
//     const params = {
//       page: this.#page,
//       q: this.#query,
//       per_page: this.#per_page,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//     };

//     const urlAXIOS = `?key=${API_KEY}`;
//     // const urlAXIOS = `?key=${API_KEY}&q=${this.#query}&page=${this.#page}&per_page=${this.#per_page}`;

//     const { data } = await axios.get(urlAXIOS, { params });
//     return data;
//   }

//   get query() {
//     this.#query;
//   }

//   set query(newQuery) {
//     this.#query = newQuery;
//   }

//   incrementPage() {
//     this.#page += 1;
//   }

//   resetPage() {
//     this.#page = 1;
//   }

//   setTotal(total) {
//     this.#totalPages = total;
//   }

//   hasMorePhotos() {
//     return this.#page < Math.ceil(this.#totalPages / this.#per_page);
//   }
// }
