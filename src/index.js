import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App'
import firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { reactReduxFirebase, firebaseReducer, getFirebase } from 'react-redux-firebase'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux';

const config = {
	//your firebase configuration
}

const rrfConfig = {
	userProfile: 'users',
	attachAuthIsReady: true,
	firebaseStateName: 'firebase'
}


firebase.initializeApp(config)

const createStoreWithFirebase = compose(
	reactReduxFirebase(firebase, rrfConfig),
)(createStore)


const rootReducer = combineReducers({
	firebase: firebaseReducer,
})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {}


const store = createStoreWithFirebase(
	rootReducer,
	initialState,
	composeEnhancers(
		applyMiddleware(ReduxThunk)
	)
)

const waitForAuth = () => {
	store.firebaseAuthIsReady.then(() => {
		console.log('Auth has loaded')
	})
	return store;
}



ReactDOM.render(
	<Provider store={waitForAuth()}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('root'));
registerServiceWorker();