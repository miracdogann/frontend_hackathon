import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function QnAChat() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // Scroll always to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const askQuestion = async () => {
    if (!question.trim() && !url.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "error",
          text: "Lütfen en az bir soru veya URL girin.",
        },
      ]);
      return;
    }

    // Kullanıcı mesajı
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: question || url },
    ]);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/qna", {
        url,
        question,
      });

      const {
        ai_answer,
        question: returnedQuestion,
        qa_data_length,
      } = res.data;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "assistant",
          text: `❓ ${returnedQuestion}\n\n💬 ${ai_answer}\n\n📊 Veri uzunluğu: ${qa_data_length}`,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          type: "error",
          text:
            err.response?.data?.error ||
            "Bir hata oluştu, lütfen daha sonra tekrar deneyin.",
        },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[380px] bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden font-sans">
      {/* Başlık */}
      <div className="flex items-center p-3 bg-orange-500 text-white">
        <h2 className="text-lg font-semibold">Trendyol Asistan 🤖</h2>
      </div>

      {/* Chat kutusu */}
      <div
        ref={chatRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg whitespace-pre-wrap ${
                  msg.type === "user"
                    ? "bg-orange-500 text-white"
                    : msg.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </div>

      {/* Giriş Alanı */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ürün URL'sini girin (opsiyonel)"
          className="text-sm p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ürünle ilgili sorunuzu yazın..."
          className="text-sm p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none h-16"
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          className="mt-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed w-full"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
