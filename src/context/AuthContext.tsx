import { createContext, useContext, useState } from "react";
import api from "../api/api";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (u: string, p: string) => Promise<void>;
  signup: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh"));

  const saveTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  };

  const login = async (username: string, password: string) => {
    const res = await api.post("/login", { username, password });
    saveTokens(res.data.access_token, res.data.refresh_token);
  };

  const signup = async (username: string, password: string) => {
    await api.post("/create-user", { username, password });
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
