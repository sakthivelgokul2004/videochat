import React, { useEffect, useState } from "react";
import {
  useIsLoginContex,
  useSetIsLoginContex,
  useSetUserContex,
  useUserContex,
} from "../contex/userContex";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addUser } from "../utils/adduser";

export const useisUserPersisted = () => {
  const [loading, setLoading] = useState(false);
  let isLogin = useIsLoginContex();
  let data = useUserContex();
  const setuser = useSetUserContex();
  const auth = getAuth();
  const setlogin = useSetIsLoginContex();

  useEffect(() => {
    async function notu() {
      setLoading(true);
      let unsubcribe = await onAuthStateChanged(auth, async (user) => {
        if (user) {
          const user = auth.currentUser;
          let userDetail = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };
          console.log(userDetail);
          setlogin((prevs) => true);
          setuser((prevs) => ({
            ...prevs,
            ...userDetail,
          }));
          await addUser();
        }
      });

      setLoading(false);
    }
    notu();
  }, []);

  return { loading };
};
