import { useContext, useEffect } from "react";
import { AuthContext } from "./auth.context";
import { login, register, logout, getMe } from "../services/api.service";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });

      // ✅ FIX
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });

      // ✅ FIX
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        // ✅ FIX
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

      } catch (err) {
        console.log(err);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    // Check localStorage first
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    getAndSetUser();
  }, []);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};