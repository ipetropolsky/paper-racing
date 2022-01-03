import { createStore, applyMiddleware, compose, Middleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './rootReducer';

type Store = { [K in keyof typeof rootReducer]: ReturnType<typeof rootReducer[K]> };

declare module 'react-redux' {
    interface DefaultRootState extends Store {
        foo: string;
    }
}

const combinedReducer = combineReducers(rootReducer);

const configureStore = () => {
    const middlewareEnhancer = applyMiddleware(thunkMiddleware as Middleware);
    const composedEnhancers = compose(middlewareEnhancer);
    return createStore(combinedReducer, undefined, composedEnhancers);
};

const store = configureStore();

export default store;
