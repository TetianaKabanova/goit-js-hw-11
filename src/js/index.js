import PixabayAPI from './PixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './LoadMoreBtn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

let page = 1;
const pixabayApi = new PixabayAPI();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchPhotos);

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSubmit(e) {
  e.preventDefault();
  page = 1;
  loadMoreBtn.show();
  pixabayApi.resetPage();

  const form = e.currentTarget;
  const searchQuery = form.elements.searchQuery.value.trim();
  pixabayApi.query = searchQuery;

  if (searchQuery === '') {
    loadMoreBtn.hide();
    Notiflix.Notify.failure('Please specify your search query.');
    return;
  }

  clearGalleryList();
  fetchPhotos().finally(() => form.reset());
}

async function fetchPhotos() {
  loadMoreBtn.disable();
  try {
    const markup = await getPhotosMarkup();
    updateGalleryList(markup);
    loadMoreBtn.enable();

    if (page > 2) {
      smoothScroll();
    }
  } catch (err) {
    onError(err);
  }
}
async function getPhotosMarkup() {
  try {
    const { hits, totalHits } = await pixabayApi.getPhotos();
    const totalPages = pixabayApi.countTotalPages(totalHits);

    loadMoreBtn.show();
    loadMoreBtn.enable();

    console.log(page);
    console.log(totalPages);
    console.log(totalHits);

    if (totalHits === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      return;
    }

    if (page > totalPages) {
      loadMoreBtn.hide();
      return Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (hits.length === totalHits) {
      loadMoreBtn.hide();
      Notiflix.Notify.warning('These are all images for your request.');
    }

    page += 1;

    return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
  } catch (err) {
    onError(err);
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a class="gallery__link" href='${largeImageURL}'>
  <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />

  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>

  </div>
</div>
 </a>`;
}

function updateGalleryList(markup) {
  if (markup !== undefined)
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGalleryList() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  clearGalleryList();
  updateGalleryList(
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    )
  );
}

// *нескінченне завантаження зображень під час прокручування сторінки

// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     onLoadMore();
//   }
// }
// window.addEventListener('scroll', handleScroll);
// *плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
