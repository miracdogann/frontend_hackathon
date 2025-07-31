import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("trendyol-asistan-root");
if (container) {
  ReactDOM.createRoot(container).render(<App />);
} else {
  console.error("trendyol-asistan-root element not found");
}
