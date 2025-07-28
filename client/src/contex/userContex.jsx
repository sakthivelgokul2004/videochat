import { createContext, useContext, useState, useEffect } from "react";

const UserContex = createContext();
const AuthContex = createContext();

export function useUserContex() {
  return useContext(UserContex);
}
export function useAuthContex() {
  return useContext(AuthContex);
}

export function UserProvider({ children }) {
  let [auth, setAuth] = useState(false);
  let [user, setUser] = useState({ displayName: "", email: "", photoURL: "" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/user", {
          method: 'GET',
        })
        if (res.ok) {
        const data = await res.json()
        console.log("User:", data)
        console.log("User:", data.userName)
        setUser((prvies) => ({ displayName: data.userName, email: data.email, photoURL: data.photoUrl }))
        setAuth(true);
        }
        else{
          console.log("Not Authenticated")
          setAuth(false);
          setUser({ displayName: "", email: "", photoURL: "" });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setAuth(false);
        console.log(error)
      }
    }
    auth()
  }, [])

  return (
    <>
      <UserContex.Provider value={[user, setUser]}>
        <AuthContex.Provider value={[auth, setAuth, loading]}>
          {children}
        </AuthContex.Provider>
      </UserContex.Provider>
    </>
  );
}
