//Parent- contains spinner and errors to give to children

import icons from '../../img/icons.svg'; //all the icons ../ before img - go one more up to folder

export default class view {
  _data;
  _message = 'Start by searching for a recipe!';
  _errorMessage = 'We could not find that recipe. Please try another one!';

  /**
   * Render the received object to the DOM
   * @param {Object \ Object[]} data The data to be rendered(e.g recipe)
   * @param {boolean} {render=true} if false, create markup string instead of rendering to the DOM
   * @returns {undefined \ string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Taye Shodehinde
   * @todo Finish implementation
   */

  render(data, render = true) {
    //true bcos of bookmark
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); //If there’s no data,
    // or the data is an empty array
    //if it has no items - data.length === 0
    //— then handle that case.

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //✅
  }

  // diffing
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError(); //to not show error first in search results

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //converts strings into real DOM node objects
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements); //new markup but not
    // rendering just console
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); //Array.from creates an iterable array
    // console.log(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //updates changed TEXT

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) console.log(newEl.attributes); //log the attribute property
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value)
      );
    }); //replace the attributes in the newEl
  }

  // marked result, should stay when selected

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    //public method because not want to import in controller
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

//SPOONACULAR API - best for food

//just exporting immediately
//because use for parent class
