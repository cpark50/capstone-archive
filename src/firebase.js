// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, deleteUser as deleteFirebaseUser } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS_M4KphVIZHQvDUibhsUIbFkSE7VbCYs",
  authDomain: "winter-191-for-191.firebaseapp.com",
  projectId: "winter-191-for-191",
  storageBucket: "winter-191-for-191.appspot.com",
  messagingSenderId: "361109017966",
  appId: "1:361109017966:web:2a2588d677e88717511d7f",
  measurementId: "G-GE2HZD1T89"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const apiKey = firebaseConfig.apiKey;

export const deleteUserAuth = async (id) => {
  try {
      await deleteFirebaseUser(auth.currentUser); // Pass auth.currentUser as argument
      console.log("User deleted from Firebase Authentication");
  } catch (error) {
      console.error("Error deleting user from Firebase Authentication:", error);
      throw error;
  }
};
