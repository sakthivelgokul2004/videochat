import app from "../../firebase.config";
import { getAuth } from "firebase/auth";

export async function addUser() {
  const auth = getAuth();
  const user = auth.currentUser;
  let userObj = {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };

  const res = await fetch("http://localhost:3000/addUser", {
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
