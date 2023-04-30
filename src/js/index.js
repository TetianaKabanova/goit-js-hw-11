import { PixabayAPI } from './PixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryMarkup } from './gallery-markup';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  buttonSearch: document.querySelector('.search-form-btn'),
};

let page = 1;
const pixabayApi = new PixabayAPI();

Notiflix.Report.info('😎 Hi!', 'Are you looking for something?', 'Ok');

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
    autoScroll();

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
    autoScroll();

    if (lastPage === pixabayApi.page) {
      Notiflix.Notify.warning(
        'We are sorry, but you have reached the end of search results😉'
      );
      window.removeEventListener('scroll', handleScroll);
      return;
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
function alertIfEmptySearch() {
  Notiflix.Notify.failure('Please specify your search query.');
}

function alertEndOfSearch() {
  Notiflix.Notify.warning(
    'We are sorry, but you have reached the end of search results😉'
  );
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }
}

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
