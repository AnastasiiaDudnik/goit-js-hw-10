import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(countryInput, DEBOUNCE_DELAY));

function countryInput(evt) {
  const searchQuery = evt.target.value.trim();

  fetchCountries(searchQuery)
    .then(data => {
      if (!searchQuery) {
        list.innerHTML = '';
        info.innerHTML = '';
        return;
      }

      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length <= 10) {
        createListMarkup(data);
      }

      if (data.length === 1) {
        list.innerHTML = '';
        oneCounryMarkup(data);
      }
    })
    .catch(error => {
      list.innerHTML = '';
      info.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function oneCounryMarkup(arr) {
  const markup = arr
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) =>
        `<h2>
        <img src="${svg}" alt="${official}" width=30 height=20">
              <span>${official}</span>
          </h2>
        <ul>
          <li>Capital: ${capital}</li>
          <li>Population: ${population}</li>
          <li>Languages: ${Object.values(languages).join(', ')}</li>
        </ul>`
    )
    .join('');

  info.innerHTML = markup;
}

function createListMarkup(arr) {
  const listMarkup = arr
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li>
        <img src="${svg}" alt="${official}" width=20 height=20">
        </img>
        <span>${official}</span>
          </li>`
    )
    .join('');

  list.innerHTML = listMarkup;
}
