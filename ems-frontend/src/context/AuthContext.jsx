import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function isTokenValid(token) {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!payload.exp) return false;

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setAuth({
      token: null,
      username: null,
      role: null,
    });
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);

    setAuth({
      token: data.token,
      username: data.username,
      role: data.role,
    });
  };

  const isAuthenticated = isTokenValid(auth.token);

  useEffect(() => {
    if (auth.token && !isTokenValid(auth.token)) {
      logout();
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}