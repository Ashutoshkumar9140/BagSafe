import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppProvider from "./context/AppContext";
import "./styles.css";

// ........................ restore the saved theme before React renders ........................
const savedTheme = localStorage.getItem("bagsafeTheme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
  if (!savedTheme) {
    localStorage.setItem("bagsafeTheme", "light");
  }
}

// ......................... start the BagSafe application ................................
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/BagSafe">
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
