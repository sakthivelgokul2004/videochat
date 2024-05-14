import {
  GoogleAuthProvider,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithCredential,
} from "firebase/auth";

export default function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  const idToken = response.credential;
  const credential = GoogleAuthProvider.credential(idToken);
  const auth = getAuth();
  // Sign in with credential from the Google user.
  setPersistence(auth, browserLocalPersistence).then(async () => {
    try {
      return await signInWithCredential(auth, credential);
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The credential that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
    }
  });
}
