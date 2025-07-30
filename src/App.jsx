import { useState } from "react";
import "./App.css";
import TrendAsistanAi from "./pages/TrendAsistanAi";
import QnAChat from "./pages/QnaAi";
import CommentAi from "./pages/CommentAi";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [activeComponent, setActiveComponent] = useState("asistan");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AnimatePresence mode="wait">
        {activeComponent === "asistan" && (
          <motion.div
            key="asistan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <TrendAsistanAi setActiveComponent={setActiveComponent} />
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
            <QnAChat setActiveComponent={setActiveComponent} />
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
            <CommentAi setActiveComponent={setActiveComponent} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
