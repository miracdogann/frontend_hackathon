import { useState } from "react";
import "./App.css";
import TrendAsistanAi from "./pages/TrendAsistanAi";
import QnAChat from "./pages/QnaAi";
import CommentAi from "./pages/CommentAi";
import ChatUI from "./pages/ChatUI";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [activeComponent, setActiveComponent] = useState("asistan");
  return (
    <div
      className="bg-white d-flex flex-column justify-content-center align-items-center"
      style={{ width: "100%", height: "100%" }}
    >
      <AnimatePresence mode="wait">
        {activeComponent === "asistan" && (
          <motion.div
            key="asistan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <TrendAsistanAi
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
            />
          </motion.div>
        )}
        {activeComponent === "soru" && (
          <motion.div
            key="soru"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <QnAChat
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
            />
          </motion.div>
        )}
        {activeComponent === "yorum" && (
          <motion.div
            key="yorum"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <CommentAi
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
            />
          </motion.div>
        )}
        {activeComponent === "kabin" && (
          <motion.div
            key="kabin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ChatUI
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
