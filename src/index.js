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
import { currentLesson } from "./reducers";
import reducer from './reducers/index'

const config = {
	apiKey: "AIzaSyBAy8OJpBF92KMrIZADv0npaNwTK-IsWMI",
	authDomain: "project-based-plann.firebaseapp.com",
	databaseURL: "https://project-based-plann.firebaseio.com",
	projectId: "project-based-plann",
	storageBucket: "project-based-plann.appspot.com",
	messagingSenderId: "1047477395421"
}

const rrfConfig = {
	userProfile: 'users',
	attachAuthIsReady: true, // attaches auth is ready promise to store
	firebaseStateName: 'firebase' // should match the reducer name ('firebase' is default)
}


firebase.initializeApp(config)

const createStoreWithFirebase = compose(
	reactReduxFirebase(firebase, rrfConfig),
)(createStore)


const rootReducer = combineReducers({
	firebase: firebaseReducer,
	currentLesson: currentLesson
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
		console.log('Auth has loaded') // eslint-disable-line no-console
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

