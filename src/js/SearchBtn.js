refs.buttonSearch.addEventListener('click', onClickButton);
import { refs } from './refs';
export default function onClickButton() {
  refs.buttonSearch.classList.add('is-click');
  refs.spinnerIcon.style.display = 'block';

  setTimeout(() => {
    refs.buttonSearch.classList.remove('is-click');
    refs.spinnerIcon.style.display = 'none';
  }, 2000);
}
