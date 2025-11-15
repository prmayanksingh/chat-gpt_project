import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppRoutes from "./AppRoutes";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./App.css";

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <AppRoutes />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
