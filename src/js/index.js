import { PixabayAPI } from './PixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryMarkup } from './gallery-markup';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

// refs.searchForm.addEventListener('submit', onSearchForm);

Notiflix.Report.info('😎 Hi!', 'Are you looking for something?', 'Ok');

const pixabayApi = new PixabayAPI();

let lightbox = new SimpleLightbox('.gallery__link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onRenderPage);

async function onRenderPage(e) {
  e.preventDefault();
  window.addEventListener('scroll', handleScroll);

  refs.gallery.innerHTML = '';

  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApi.query = searchQuery;

  pixabayApi.resetPage();
  pixabayApi.page = 1;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please specify your search query 🤓');
    return;
  }

  try {
    const response = await pixabayApi.fetchPhotosByQuery();
    const totalPicturs = response.data.totalHits;

    if (totalPicturs === 0) {
      Notiflix.Notify.failure('Please specify your search query 🤓');
      return;
    }

    createMarkup(response.data.hits);
    lightbox.refresh();

    Notiflix.Notify.success(`Hooray! We found ${totalPicturs} images.`);
  } catch (err) {
    console.log(err);
  }
}

async function onLoadMore() {
  pixabayApi.page += 1;

  try {
    const response = await pixabayApi.fetchPhotosByQuery();

    const lastPage = Math.ceil(response.data.totalHits / pixabayApi.per_page);

    createMarkup(response.data.hits);

    lightbox.refresh();

    if (totalHits < perPage) {
      refs.btnLoadMore.classList.add('is-hidden');
      //   Notiflix.Notify.warning(
      //     'We are sorry, but you have reached the end of search results😉'
      //   );
      window.removeEventListener('scroll', handleScroll);
      //   return;
    }
  } catch (err) {
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results😉'
    );
  }
}

function createMarkup(hits) {
  const markup = createGalleryMarkup(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

// refs.btnLoadMore.addEventListener('click', fetchImages);

// fetchImages(({ query, page, perPage })) {

//     if (data.totalHits === 0) {
//         Notiflix.Notify.failure(
//             'Sorry, there are no images matching your search query. Please try again.'
//         );
//     } else {
//         renderGallery(data.hits);
//         simpleLightBox = new SimpleLightbox('.gallery__link').refresh();
//         Notiflix.Notify.success(
//             `Hooray! We have found ${data.totalHits} images.`
//         );
//     }

//         refs.searchForm.reset();
// }
// function onloadMore() {
//   page += 1;
//   //   simpleLightBox.destroy();
//   fetchImages(query, page, perPage)
//     .then(data => {
//       renderGallery(data.hits);
//       simpleLightBox = new SimpleLightbox('.gallery a').refresh();
//       const totalPages = Math.ceil(data.totalHits / perPage);
//       if (page > totalPages) {
//         Notiflix.Notify.failure(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     })
//     .catch(error => console.log(error));
// }

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
  );
}

// Бескінечний скрол
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }
}

// function onSearchForm(e) {
//   e.preventDefault();
//   page = 1;
//   query = e.currentTarget.elements.searchQuery.value.trim();
//   refs.gallery.innerHTML = '';
//   if (query === '') {
//     Notiflix.Notify.failure(
//       'The search string cannot be empty. Please specify your search query.'
//     );
//     return;
//   }

//

// Автоматичне прокручування сторінки на висоту двух картинок
function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// function showLoadMorePage() {
//   if (checkIfEndOfPage()) {
//     onloadMore();
//   }
// }

// window.addEventListener('scroll', showLoadMorePage);
