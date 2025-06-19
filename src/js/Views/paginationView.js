import view from './view.js';
import icons from '../../img/icons.svg'; //all the icons ../ before img - go one more up to folder

class PaginationView extends view {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Event delegation - looking for parent
      //🟦 blue in console is number
      //⬛ black in console is string
      const btn = e.target.closest('.btn--inline');
      if (!btn) return; //guard clause for in-between pages
      // console.log(btn);

      const goTo = +btn.dataset.goto; //(convert to number)
      // console.log(goTo);
      handler(goTo);
    });
  } //publisher

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    //length of the array divided by results per page
    //to check how many pages
    //Math.ceil rounds decimal to number e.g- 2.7 - 3

    //page 1 and there are other page

    //p = 1 and num-total greater than 1: page 2->
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButtonRight(curPage + 1); //next button
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButtonLeft(curPage - 1); //previous button
    }
    //   //Other page
    if (curPage < numPages) {
      return (
        this._generateMarkupButtonLeft(curPage - 1) +
        this._generateMarkupButtonRight(curPage + 1)
      );
    }

    //   //page 1, and there are NO other pages
    return '';
  }
  _generateMarkupButtonRight(page) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--next">
            <span>Page ${page}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
          </button>`;
  }
  _generateMarkupButtonLeft(page) {
    return `
         <button data-goto="${page}" class="btn--inline pagination__btn--prev">
             <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${page}</span>
            </button>`;
  }
}

export default new PaginationView();
