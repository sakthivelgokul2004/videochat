import {
  GoogleAuthProvider,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  browserPopupRedirectResolver,
  getRedirectResult,
  browserSessionPersistence,
} from "firebase/auth";

export default async function handleCredentialResponse() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider, browserPopupRedirectResolver);

  const result = await getRedirectResult(auth);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  // Sign in with credential from the Google user.
  setPersistence(auth, browserSessionPersistence)
    .then(async () => {
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
    })
    .catch((e) => console.log(e));
}
