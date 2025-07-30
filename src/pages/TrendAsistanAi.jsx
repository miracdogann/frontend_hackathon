import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { baseUrl } from "../../baseUrl";

export default function TrendAsistanAi({
  setActiveComponent,
  activeComponent,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Mesaj geçmişi için array
  const [loader, setLoader] = useState(false);
  const chatContainerRef = useRef(null);

  // Yeni mesaj eklendiğinde otomatik kaydırma
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessage = async () => {
    if (!message.trim()) {
      setMessages((prev) => [
        ...prev,
        { type: "error", text: "Lütfen bir mesaj yazın.", id: Date.now() },
      ]);
      return;
    }

    // Kullanıcı mesajını ekle
    setMessages((prev) => [
      ...prev,
      { type: "user", text: message, id: Date.now() },
    ]);
    setLoader(true);

    try {
      const response = await axios.post(`${baseUrl}/api/chat`, { message });
      const { gemini_response, url } = response.data;
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          text: gemini_response || "Yanıt alınamadı.",
          url: url || "",
          id: Date.now() + 1,
        },
      ]);
      setMessage(""); // Input'u sıfırla
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text:
            error.response?.data?.message ||
            "Bir hata oluştu, lütfen tekrar deneyin.",
          id: Date.now() + 1,
        },
      ]);
    } finally {
      setLoader(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessage();
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-[550px] bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden font-sans transition-opacity duration-300">
      {/* Başlık ve Butonlar */}
      <div className="flex items-center justify-between p-3 bg-orange-500 text-white">
        <h2 className="text-lg font-semibold">Trendyol Asistan</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveComponent("asistan")}
            className={`px-2 py-1 text-sm rounded text-white ${
              activeComponent === "asistan"
                ? "bg-orange-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            AiAsistan
          </button>
          <button
            onClick={() => setActiveComponent("soru")}
            className={`px-2 py-1 text-sm rounded text-white ${
              activeComponent === "soru"
                ? "bg-orange-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Soru-Cevap Ai
          </button>
          <button
            onClick={() => setActiveComponent("yorum")}
            className={`px-2 py-1 text-sm rounded text-white ${
              activeComponent === "yorum"
                ? "bg-orange-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Yorum-Analiz Ai
          </button>
        </div>
      </div>

      {/* Sohbet Alanı */}
      <div
        ref={chatContainerRef}
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
                className={`max-w-[75%] p-3 rounded-lg ${
                  msg.type === "user"
                    ? "bg-orange-500 text-white"
                    : msg.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.text}
                {msg.url && (
                  <a
                    href={msg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm text-center"
                  >
                    Ürünleri Gör
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loader && (
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
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <textarea
            id="user_message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none h-10"
            aria-label="Trendyol asistanına mesaj gönder"
          />
          <button
            onClick={handleMessage}
            disabled={loader}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
            aria-label="Mesajı gönder"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
