import app from "../../firebase.config"
import { getAuth,signInWithRedirect, GoogleAuthProvider,browserPopupRedirectResolver } from "firebase/auth";

export async function signWithGoogle() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider, browserPopupRedirectResolver)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

export async function addUser(){
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user.displayName, user.email, user.photoURL);
  let userObj = {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };

  const res = await fetch("/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(userObj),
  });
  if (res.ok) {
    console.log("yess");
  }
} 