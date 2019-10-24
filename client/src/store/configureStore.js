import {createStore , combineReducer } from redux

const configureStore = () => {
    const store = createStore(combineReducer({

    }))
    return store
}

export default configureStore