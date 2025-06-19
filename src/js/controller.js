import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import bookmarksView from './Views/bookmarksView.js';
import paginationView from './Views/paginationView.js';
import addRecipeView from './Views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable'; //for older versions
import 'regenerator-runtime/runtime'; // for older browsers - async/await

// console.log(icons);

// const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// const renderSpinner = ...

// parcel feature
// if (module.hot) {
//   module.hot.accept();
// } //it update code in place without reloading the
// whole page.

const controlRecipes = async function () {
  //loading recipe
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) {
      recipeView.renderMessage();
      return; //guard clause - if not id
    }
    recipeView.renderSpinner(); //spinner from recipeView

    //0} Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // update bookmark, afterbegin bug
    // 1)Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //loading spinner
    // renderSpinner(recipeContainer);

    // 2) Loading recipe
    //await returns promises
    await model.loadRecipe(id);

    // console.log(recipe);

    // 3)Rendering recipe
    recipeView.render(model.state.recipe);

    // const res = await fetch(
    //  ...
    // console.log(recipe); //-model.js

    //Rendering recipe
    // const markup = ` <figure class="recipe__fig">
    //...
    // recipeContainer.insertAdjacentHTML('afterbegin', markup); //- to recipe.view
    //TEST
    // controlServings();
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
    console.error(err);
  }
}; //subscriber

// showRecipe();

const controlSearchResults = async function () {
  try {
    // console.log(resultsView);
    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // Rendering results in console
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage()); //inherits from view //empty() is same as (1)

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    // resultsView.renderError();
  }
}; //subscriber
// controlSearchResults();

const controlPagination = function (goToPage) {
  // console.log('Pag controller');
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage)); //inherits from view

  // 2) Render initial pagination buttons
  paginationView.render(model.state.search);

  // console.log(goToPage);
}; //subscriber

//refracted way for this eventlisteners
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// ); - recipeView.js

// window.addEventListener('hashchange', showRecipe); //to switch hash
// window.addEventListener('load', showRecipe); //to load hash

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
}; //subscriber

const controlAddBookMark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //if not bookmarked already, addBookmark
  //if bookmarked, remove -deleteBookmark

  // console.log(model.state.recipe);
  // 2)
  recipeView.update(model.state.recipe); //use update
  // so it changes only the new changes and not whole
  // page

  // 3) Render bookmark
  bookmarksView.render(model.state.bookmarks);

  //change ID in URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`);
  //show when add but don't show when removed
}; //subscriber

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //Render bookmark view - local storage
    bookmarksView.render(model.state.bookmarks);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🐦‍🔥🐦‍🔥', err);
    addRecipeView.renderError(err.message);
  }
}; //subscriber

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init(); //Publisher-Subscriber patterns
