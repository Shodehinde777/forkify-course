import view from './view.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg'; //all the icons ../ before img - go one more up to folder

class BookmarksView extends view {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe to bookmark :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  //   _generateMarkup() {
  //   const id = window.location.hash.slice(1);
  //   return `
  //   <li class="preview">
  //     <a class="preview__link ${
  //       result.id === id ? 'preview__link--active' : ''
  //     }" href="#${result.id}">
  //       <figure class="preview__fig">
  //         <img src="${result.image}" alt="${result.title}" />
  //       </figure>
  //       <div class="preview__data">
  //         <h4 class="preview__title">${result.title}</h4>
  //         <p class="preview__publisher">${result.publisher}</p>
  //         <div class="preview__user-generated"></div>
  //       </div>
  //     </a>
  //   </li>
  // `;
  // }
  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  // import previewView, instead of writing it again after resultsview
}

export default new BookmarksView();
