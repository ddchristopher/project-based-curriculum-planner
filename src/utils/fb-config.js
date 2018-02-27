import firebase from 'firebase'

const config = {
		apiKey: "AIzaSyCg6guYihfCxGo-DxJsYQhF4i4v2Lt4uSk",
		authDomain: "inps-lesson-planner.firebaseapp.com",
		databaseURL: "https://inps-lesson-planner.firebaseio.com",
		projectId: "inps-lesson-planner",
		storageBucket: "inps-lesson-planner.appspot.com",
		messagingSenderId: "18542274350"
	};
firebase.initializeApp(config);
export default firebase