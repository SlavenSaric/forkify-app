import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import bookmarksView from './views/bookmarksView.js'
import paginationView from './views/paginationView.js'
import addRecipeView from './views/addRecipeView.js'
import { MODAL_CLOSE_SEC } from './config.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime'

if (module.hot) {
  module.hot.accept()
}

//////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSipnner()

    //
    resultsView.update(model.getSearchResultsPage())


    bookmarksView.update(model.state.bookmarks)
    //Loading recipe
    await model.loadRecipe(id)

    //render recipe
    recipeView.render(model.state.recipe)

  } catch (err) {
    console.log(err)
    recipeView.renderError()
    console.error(err)
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSipnner()
    //get query
    const query = searchView.getQuery()
    if (!query) return

    //load results
    await model.loadSearchResults(query)

    //render results
    resultsView.render(model.getSearchResultsPage())

    //render pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  //update recipe servings(in state)
  model.updateServings(newServings)

  //update the recipe view
  //recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)

}

const controlAddBookmark = function () {
  //add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else { model.deleteBookmark(model.state.recipe.id) }

  console.log(model.state.recipe)
  //updatea recipe view
  recipeView.update(model.state.recipe)
  //render bookmarksView
  bookmarksView.render(model.state.bookmarks)

}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controladdRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSipnner()

    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)
    recipeView.render(model.state.recipe)

    addRecipeView.renderMessage()

    //render bookmark
    bookmarksView.render(model.state.bookmarks)

    //change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    // window.history.back(K)

    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error(err)
    addRecipeView.renderError(err.message)
  }


}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe)
  searchView.addHandlerSearch(controlSearchResults)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerUpdateServings(controlServings)
  addRecipeView._addHandlerUpload(controladdRecipe)
}

init()