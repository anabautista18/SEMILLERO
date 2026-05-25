import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

if (window.location.pathname && window.location.pathname.startsWith('/admin')) {
  import('./pages/Admin').then(({ default: Admin }) => {
    root.render(
      <React.StrictMode>
        <Admin />
      </React.StrictMode>
    );
  });
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
