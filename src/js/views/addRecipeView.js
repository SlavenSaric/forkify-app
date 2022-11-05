import View from "./View.js";
import icons from './../../img/icons.svg'


class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload')
    _message = 'Recipe was successfully uploaded'
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _botnOpen = document.querySelector('.nav__btn--add-recipe')
    _botnClose = document.querySelector('.btn--close-modal')

    constructor() {
        super()
        this._addHandlerShowWindow()
        this.addHandlerHideWindow()
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden')
        this._window.classList.toggle('hidden')
    }

    _addHandlerShowWindow() {
        this._botnOpen.addEventListener('click', this.toggleWindow.bind(this))
    }

    addHandlerHideWindow() {
        this._botnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))
    }

    _addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault()
            const dataArray = [...new FormData(this)]
            const data = Object.fromEntries(dataArray)
            handler(data)
        })
    }


    _generateMarkup() {

    }
}

export default new AddRecipeView()