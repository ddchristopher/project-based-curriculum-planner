import firebase from 'firebase'

const config = {
	apiKey: "AIzaSyBAy8OJpBF92KMrIZADv0npaNwTK-IsWMI",
	authDomain: "project-based-plann.firebaseapp.com",
	databaseURL: "https://project-based-plann.firebaseio.com",
	projectId: "project-based-plann",
	storageBucket: "project-based-plann.appspot.com",
	messagingSenderId: "1047477395421"
	};
firebase.initializeApp(config);
export default firebase