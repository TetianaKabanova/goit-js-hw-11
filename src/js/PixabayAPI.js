import axios from 'axios';

// const URL = 'https://pixabay.com/api/';
// const API_KEY = '35851703-1327ea85a263036dc5c6068c0';

// function getPhotos(query) {
//   return fetch(`${URL}?key=${API_KEY}&q=${query}&per_page=40`).then(data =>
//     data.json()
//   );
// }

// export { getPhotos };

export default class PixabayAPI {
  static URL = 'https://pixabay.com/api/';
  static API_KEY = '35851703-1327ea85a263036dc5c6068c0';
  constructor() {
    this.page = 1;
    // #per_page = 40;
    this.query = '';
    // #totalPages = 0;
  }
  getPhotos() {
    const url = `${PixabayAPI.URL}?key=${PixabayAPI.API_KEY}&q=${this.query}&per_page=40&page=${this.page}`;
    return fetch(url).then(data => {
      this.incrementPage();
      return data.json();
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

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
