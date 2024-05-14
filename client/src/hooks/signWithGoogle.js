import app from "../../firebase.config";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  browserPopupRedirectResolver,
} from "firebase/auth";

// export async function signWithGoogle() {
//   const auth = getAuth(app);
//   const provider = new GoogleAuthProvider();
//   let result = await setPersistence(auth, browserLocalPersistence)
//     .then(() => {
//       return signInWithPopup(auth, provider, browserPopupRedirectResolver);
//     })
//     .catch((e) => console.log(e));

//   if (result != undefined) {
//     return "success";
//   } else {
//     return "error";
//   }
// }
export async function signInWithGoogle() {
  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
  }
  window.onload = function () {
    // also display the One Tap dialog
  };
}
export async function addUser() {
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
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  });
  if (res.ok) {
    console.log("yess");
  }
}
