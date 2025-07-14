import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.jsx";
import { WindowSizeProvider } from "./context/WindowSizeContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <StrictMode>
      <SocketProvider>
        <WindowSizeProvider>
          <App />
        </WindowSizeProvider>
      </SocketProvider>
    </StrictMode>
  </Router>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "/"
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  });
}
