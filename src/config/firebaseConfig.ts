// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASeX4KwIoxVC8P8DSBdWv-_ttLHTkR-IU",
    authDomain: "pracitce-upload-file-1.firebaseapp.com",
    projectId: "pracitce-upload-file-1",
    storageBucket: "pracitce-upload-file-1.appspot.com",
    messagingSenderId: "954289870317",
    appId: "1:954289870317:web:d0ad61bffe05786f4c83e4",
    measurementId: "G-X9C2V8TS91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { storage };