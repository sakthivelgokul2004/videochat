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
        const data = await res.json()
        if (data.error || data.auth == false) {
          setLoading(false);
          setAuth(false);
          return;
        }
        console.log("User:", data)
        console.log("User:", data)
        setUser((prvies) => (data.user))
        setLoading(false);
        setAuth(true);
      } catch (error) {
        setLoading(false);
        setAuth(false);
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
