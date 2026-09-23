import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false);
  useEffect(() => {
    localStorage.getItem('token')
      ? api('/auth/profile').then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setReady(true))
      : setReady(true);
  }, []);
  const signIn = ({ token, user }) => { localStorage.setItem('token', token); setUser(user); };
  const signOut = () => { localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{ user, ready, signIn, signOut }}>{children}</Ctx.Provider>;
}
