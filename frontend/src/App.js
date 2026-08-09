import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  // Keep the logged-in user and theme after a page refresh.
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("leaveUser")) || null
  );
  const [theme, setTheme] = useState(
    localStorage.getItem("leaveTheme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("leaveTheme", theme);
  }, [theme]);

  /**
   * Stores the logged-in user and opens the dashboard.
   * @param {Object} loggedInUser - User returned by the login API.
   */
  const handleLogin = (loggedInUser) => {
    localStorage.setItem("leaveUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  // Clearing local storage also returns the app to the login screen.
  const handleLogout = () => {
    localStorage.removeItem("leaveUser");
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return user ? (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  ) : (
    <LoginPage
      onLogin={handleLogin}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;
