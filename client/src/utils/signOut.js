import { getAuth } from "firebase/auth";
export function signOut() {
  const auth = getAuth();
  console.log("signOut");
  auth.signOut();
}
