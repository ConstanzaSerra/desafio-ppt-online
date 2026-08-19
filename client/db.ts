import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3yS2c_A7u1BxnW18MIfbIyEDJwwL_Oiw",
  authDomain: "apx-dwf-m6-a7b40.firebaseapp.com",
  databaseURL: "https://apx-dwf-m6-a7b40-default-rtdb.firebaseio.com",
  projectId: "apx-dwf-m6-a7b40",
};

firebase.initializeApp(firebaseConfig);

export const rtdb = firebase.database();
