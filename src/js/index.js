import { PixabayAPI } from './PixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryMarkup } from './gallery-markup';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

Notiflix.Report.info('😎 Привіт!', 'Шукаєш щось цікаве?', 'Ok');

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
    alertNoEmptySearch();
    return;
  }

  try {
    const response = await pixabayApi.fetchPhotosByQuery();
    const totalPicturs = response.data.totalHits;

    if (totalPicturs === 0) {
      alertNoEmptySearch();
      return;
    }

    createMarkup(response.data.hits);
    lightbox.refresh();

    Notiflix.Notify.success(`Чудово! Ми знайшли ${totalPicturs} картинок.`);
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

    if (lastPage === pixabayApi.page) {
      alertEndOfSearch();
      window.removeEventListener('scroll', handleScroll);
      return;
    }
  } catch (err) {
    alertEndOfSearch();
  }
}

function createMarkup(hits) {
  const markup = createGalleryMarkup(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('Будь ласка, введіть дані у поле запиту 🤓');
}

function alertEndOfSearch() {
  Notiflix.Notify.warning(
    'Вибачте, за вашим запитом нічого не знайдено. Спробуйте ще раз😉'
  );
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }
}
