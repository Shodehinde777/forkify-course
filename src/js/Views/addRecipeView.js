import view from './view.js';
import icons from '../../img/icons.svg'; //all the icons ../ before img - go one more up to folder

class AddRecipeView extends view {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded';
  _window = document.querySelector('.add-recipe-window ');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._handlerShowWindow();
    this._handlerCloseWindow();
  } //a constructor cos only useful in this class but
  // still import file in controller though

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden'); //better
    // and not necessary in controller only in this class
  }

  // open window
  _handlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  // close window
  _handlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      // console.log(dataArr);
      // Convert form data into an array of [name, value] pairs.
      // 'this' refers to the form element.
      // FormData grabs all input values from the form.
      // Using the spread operator converts the FormData object into a regular array.

      const data = Object.fromEntries(dataArr);
      // fromEntries Convert array to object for easy access
      handler(data); //handlers always controlAdd...
      //in controller
    }); //publisher
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
