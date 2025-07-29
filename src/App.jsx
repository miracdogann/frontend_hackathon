import { useState } from "react";
import "./App.css";
import TrendAsistanAi from "./pages/TrendAsistanAi";
import QnaAi from "./pages/QnaAi"; // Örnek diğer bileşenler
import CommentAi from "./pages/CommentAi"; // Örnek diğer bileşenler

function App() {
  const [activeComponent, setActiveComponent] = useState("asistan");

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveComponent("asistan")}>AiAsistan</button>
        <button onClick={() => setActiveComponent("soru")}>
          Soru-Cevap Ai
        </button>
        <button onClick={() => setActiveComponent("yorum")}>
          Yorum-Analiz Ai
        </button>
      </div>

      {/* Render edilen component */}
      {activeComponent === "asistan" && <TrendAsistanAi />}
      {activeComponent === "soru" && <QnaAi />}
      {activeComponent === "yorum" && <CommentAi />}
    </>
  );
}

export default App;
