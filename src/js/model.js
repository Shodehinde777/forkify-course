import { async } from 'regenerator-runtime'; //named imports
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';
import resultsView from './Views/resultsView';

export const state = {
  recipe: {}, // recipe from loadRecipe here
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1, //
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  }; //adding key cos only some have
};

//model is responsible for the API
export const loadRecipe = async function (id) {
  // async function calling another returns data
  try {
    const data = await AJAX(`${API_URL}${id}?key={KEY}`);
    console.log(data);

    // const res = await fetch(``)...

    // console.log(res, data);

    //    id: recipe.id,
    // title: recipe.title,
    // publisher: recipe.publisher,
    // sourceUrl: recipe.source_url,
    // image: recipe.image_url,
    // servings: recipe.servings,
    // cookingTime: recipe.cooking_time,
    // ingredients: recipe.ingredients,

    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    //the bookmark is either true or false, use some
    //because not all

    console.log(state.recipe); //state.recipe represents state then recipe
  } catch (err) {
    //Temp error handling
    console.error(`${err} 🐦‍🔥🐦‍🔥🐦‍🔥`);
    throw err;
  }
};

// Implementing Search func

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }), //for icon to appear
        //in search results
      };
    });
    // console.log(state.search.results);
    state.search.page = 1; //page default to 1
  } catch (err) {
    console.error(`${err} 🐦‍🔥🐦‍🔥`);
    throw err;
  }
};

// loadSearchResults('pizza'); //just test in the console

// Pagination
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; //for any number

  const start = (page - 1) * state.search.resultsPerPage; //0; //10 - page no 1- 1 = 0 * 10
  const end = page * state.search.resultsPerPage; // 9; 1 * 10 = 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQt * newServings / oldServings //2 * 8/4 = 4
  });

  state.recipe.servings = newServings; //updating the current servings
};

// localStorage for Bookmarks

const PersistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

//Bookmarks
// Adding Bookmark
export const addBookmark = function (recipe) {
  //Add Bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id)
    //current recipe = former recipe
    state.recipe.bookmarked = true;
  // then now new = true

  PersistBookmarks();
};

// Removing Bookmark
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1); //-delete only 1

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id)
    //current recipe = former recipe
    state.recipe.bookmarked = false; //not bookmarked

  PersistBookmarks(); //in localstorage but disappears in render
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}; //parse converts string back to an object
init();
console.log(state.bookmarks); //bookmarks array

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
}; //just for dev

// upload recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      //must start with ing and remaining not empty
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        //to trim and put space and , then return in object

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        // if not up to 3 or 3, throw error

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      }); // if no number, put 1

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    }; //like this because of the API, bad to good

    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    // To be able to add upload to Bookmark
    addBookmark(state.recipe);
    // console.log(data);
  } catch (err) {
    throw err;
  }
}; //array to object(opposite of fromEntries)
