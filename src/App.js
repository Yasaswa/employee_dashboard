import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes"; // your routes config
import { AuthenticationProvider } from "./contextAuth/AuthenticationContext";

function App() {

  // ✅ PLACE IT HERE
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return (
          <React.Fragment key={route.key}>
            {getRoutes(route.collapse)}
          </React.Fragment>
        );
      }

      if (route.route && route.component) {
        return (
          <Route
            key={route.key}
            path={route.route}
            element={route.component}
          />
        );
      }

      return null;
    });

  return (
    <AuthenticationProvider>
      <Routes>
        {getRoutes(routes)}
      </Routes>
    </AuthenticationProvider>

  );
}

export default App;
