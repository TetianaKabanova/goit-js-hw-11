import PixabayAPI from './PixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './LoadMoreBtn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  buttonSearch: document.querySelector('.search-form-btn'),
};

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;

const pixabayApi = new PixabayAPI();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.searchForm.addEventListener('submit', onSubmit);

loadMoreBtn.button.addEventListener('click', fetchPhotos);

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  loadMoreBtn.show();
  const form = e.currentTarget;
  pixabayApi.query = form.elements.searchQuery.value.trim();
  pixabayApi.resetPage();
  clearGalleryList();
  fetchPhotos().finally(() => form.reset());
}

async function fetchPhotos() {
  loadMoreBtn.disable();
  try {
    const markup = await getPhotosMarkup();
    updateGalleryList(markup);
    loadMoreBtn.enable();
  } catch (err) {
    onError(err);
  }
}

async function getPhotosMarkup() {
  try {
    const { hits, totalHits } = await pixabayApi.getPhotos();
    // const totalPages = pixabayApi.countTotalPages(totalHits);

    if (hits.length === 0) {
      loadMoreBtn.hide();

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (hits.length < 40) {
      loadMoreBtn.hide();
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else Notiflix.Notify.success(`Hooray! We've found ${totalHits} images.`);
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
  `;
  lightbox.refresh();
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

// async function onLoadMore() {
//   pixabayApi.page += 1;
//   try {

//  const lastPage = Math.ceil(totalHits / pixabayApi.per_page);
//     if (lastPage === pixabayApi.page) {
//       Notiflix.Notify.failure(
//         'We are sorry, but you have reached the end of search results.'
//       );
//     }
//   }
// }
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 40) {
    fetchPhotos();
  }
}

window.addEventListener('scroll', handleScroll);

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
// const result = getPhotos('yellow+flowers');
// console.log(result);

// let page = 1;
// const pixabayApi = new PixabayAPI();

// loadMoreBtn.button.addEventListener('click', fetchImages);

// function onSearch(event) {
//   event.preventDefault();
//   page = 1;
//   newsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
//   newsApiService.resetPage();
//   clearGalleryList();
//   fetchImages();
// }

// async function fetchImages() {
//   onClickButton();

//   try {
//     const markup = await getImagesMarkup();
//     updateGalleryList(markup);
//     gallery.refresh();

//     if (page > 2) {
//       slowScroll();
//     }
//   } catch (error) {
//     onFetchError(error);
//   }
// }

// async function getImagesMarkup() {
//   try {
//     const { hits, totalHits } = await newsApiService.getImages();
//     const totalPages = newsApiService.countTotalPages(totalHits);

//     loadMoreBtn.show();
//     loadMoreBtn.enable();

//     console.log(page);
//     console.log(totalPages);
//     console.log(totalHits);

//     if (totalHits === 0) {
//       loadMoreBtn.hide();
//       return Notify.info(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }
//     if (page > totalPages) {
//       loadMoreBtn.hide();
//       return Notify.warning(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }

//     if (page === 1) {
//       Notify.success(`Hooray! We found ${totalHits} images.`);
//     }

//     if (hits.length === totalHits) {
//       loadMoreBtn.hide();
//       Notify.warning('These are all images for your request.');
//     }

//     page += 1;

//     return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
//   } catch (error) {
//     onFetchError(error);
//   }
// }

// const gallery = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionPosition: 'bottom',
//   captionDelay: 250,
// });

// function createMarkup({
//   largeImageURL,
//   tags,
//   webformatURL,
//   likes,
//   views,
//   comments,
//   downloads,
// }) {
//   return `
//    <div class='photo__card'>
//     <a href='${largeImageURL}' alt='${tags}' class='photo__link'>
//      <img src='${webformatURL}' alt='${tags}' loading='lazy' class='photo__image' />
//     </a>
//         <div class='info overlay'>
//       <p class='info-item'>
//         <b>Likes</b>${likes}
//       </p>
//       <p class='info-item'>
//         <b>Views</b>${views}
//       </p>
//       <p class='info-item'>
//         <b>Comments</b>${comments}
//       </p>
//       <p class='info-item'>
//         <b>Downloads</b>${downloads}
//       </p>
//     </div>
//   </div>`;
// }

// function updateGalleryList(markup) {
//   if (markup !== undefined) {
//     refs.gallery.insertAdjacentHTML('beforeend', markup);
//   }
// }

// function clearGalleryList() {
//   refs.gallery.innerHTML = '';
// }

// function onFetchError(error) {
//   if (newsApiService.key === '') {
//     loadMoreBtn.hide();
//     return Notify.failure('Error, invalid or missing API key');
//   }
//   if (!error.status) {
//     loadMoreBtn.hide();
//     return Notify.failure('Oops, something went wrong, please try again.');
//   }
// }

// function slowScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// let lightbox = new SimpleLightbox('.gallery__link', {
//   captions: true,
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// refs.searchForm.addEventListener('submit', onRenderPage);

// async function onRenderPage(e) {
//   e.preventDefault();
//   window.addEventListener('scroll', handleScroll);

//   refs.gallery.innerHTML = '';

//   const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
//   pixabayApi.query = searchQuery;

//   pixabayApi.resetPage();
//   pixabayApi.page = 1;

//   if (searchQuery === '') {
//     Notiflix.Notify.failure('Please specify your search query 🤓');
//     return;
//   }

//   try {
//     const response = await pixabayApi.fetchPhotosByQuery();
//     const totalPicturs = response.data.totalHits;

//     if (totalPicturs === 0) {
//       Notiflix.Notify.failure('Please specify your search query 🤓');
//       return;
//     }

//     createMarkup(response.data.hits);
//     lightbox.refresh();
//     autoScroll();

//     Notiflix.Notify.success(`Hooray! We found ${totalPicturs} images.`);
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function onLoadMore() {
//   pixabayApi.page += 1;

//   try {
//     const response = await pixabayApi.fetchPhotosByQuery();

//     const lastPage = Math.ceil(response.data.totalHits / pixabayApi.per_page);

//     createMarkup(response.data.hits);

//     lightbox.refresh();
//     autoScroll();

//     if (lastPage === pixabayApi.page) {
//       Notiflix.Notify.warning(
//         'We are sorry, but you have reached the end of search results😉'
//       );
//       window.removeEventListener('scroll', handleScroll);
//       return;
//     }
//   } catch (err) {
//     Notiflix.Notify.warning(
//       'We are sorry, but you have reached the end of search results😉'
//     );
//   }
// }

// function createMarkup(hits) {
//   const markup = createGalleryMarkup(hits);
//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }
// function alertIfEmptySearch() {
//   Notiflix.Notify.failure('Please specify your search query.');
// }

// function alertEndOfSearch() {
//   Notiflix.Notify.warning(
//     'We are sorry, but you have reached the end of search results😉'
//   );
// }

// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     onLoadMore();
//   }
// }

// function autoScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
