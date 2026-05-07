import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    // ✅ check before parsing
    if (storedUser && storedUser !== "undefined") {

      setUser(JSON.parse(storedUser));

    }

  }, []);

  return (

    <Router>

      <Routes>

        {!user ? (

          <Route
            path="*"
            element={<AuthPage setUser={setUser} />}
          />

        ) : (

          <Route
            path="*"
            element={
              <Dashboard
                user={user}
                setUser={setUser}
              />
            }
          />

        )}

      </Routes>

    </Router>

  );
}

export default App;