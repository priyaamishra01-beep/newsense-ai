import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5Ol8rN1VGIfb8DliZBkOYIr68Qr3jLeU",
  authDomain: "newsense-ai.firebaseapp.com",
  projectId: "newsense-ai",
  storageBucket: "newsense-ai.firebasestorage.app",
  messagingSenderId: "938982542435",
  appId: "1:938982542435:web:b4fe79997a894b8dc2bc56",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});