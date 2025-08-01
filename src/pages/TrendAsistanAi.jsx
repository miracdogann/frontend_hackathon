import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { baseUrl } from "../../baseUrl";
import { FiSend } from "react-icons/fi";

export default function TrendAsistanAi({
  setActiveComponent,
  activeComponent,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Yeni mesaj geldikçe scroll aşağı kayar
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Mesaj gönderme fonksiyonu
  const handleMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { type: "user", text: message, id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post(`${baseUrl}/api/chat/`, { message });
      const { gemini_response, url } = response.data;

      // Yapay yazma efekti için gecikme ekliyoruz
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            text: gemini_response || "Yanıt alınamadı.",
            url: url || "",
            id: Date.now() + 1,
          },
        ]);
      }, 1500);
    } catch (error) {
      setIsTyping(false);
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
      setIsLoading(false);
    }
  };

  // Enter ile gönderme, Shift+Enter ile alt satıra geçiş
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleMessage();
    }
  };

  // Trendyol renk paleti
  const colors = {
    primary: "#FF6000",
    primaryDark: "#E05500",
    secondary: "#1B283A",
    dark: "#0D1624",
    light: "#F5F5F5",
    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
  };

  return (
    <div
      className="d-flex flex-column rounded overflow-hidden"
      style={{
        width: "450px",
        height: "700px",
        backgroundColor: "#fff",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        border: `1px solid rgba(0, 0, 0, 0.08)`,
      }}
      role="region"
      aria-label="Trendyol Asistan Chat Botu"
    >
      {/* Başlık ve Seçim Butonları */}
      <header
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{
          backgroundColor: colors.primary,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="white"
            />
            <path
              d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
              fill="white"
            />
            <path
              d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
              fill="white"
            />
          </svg>
          <h1
            className="h5 fw-bold mb-0 text-white"
            style={{ letterSpacing: "0.5px" }}
            aria-live="polite"
            aria-atomic="true"
          >
            Trendyol Asistan
          </h1>
        </div>
        <div
          className="btn-group"
          role="group"
          aria-label="Asistan seçim butonları"
        >
          {["asistan", "soru", "yorum", "kabin"].map((key) => {
            const label =
              key === "asistan"
                ? "AI Asistan"
                : key === "soru"
                ? "Soru-Cevap"
                : key === "yorum"
                ? "Yorum-Analiz"
                : "Kabin Al";
            const active = activeComponent === key;
            return (
              <motion.button
                key={key}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`btn btn-sm ${
                  active ? "btn-dark" : "btn-outline-light"
                }`}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  borderRadius: "6px",
                  padding: "4px 8px",
                }}
                onClick={() => setActiveComponent(key)}
                aria-pressed={active}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </header>

      {/* Mesaj Kutusu */}
      <main
        ref={chatContainerRef}
        className="flex-grow-1 px-4 py-3 overflow-auto position-relative"
        style={{
          backgroundColor: colors.light,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.95))",
        }}
        tabIndex={-1}
        aria-live="polite"
        aria-relevant="additions"
      >
        {/* Hoş geldin mesajı */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center d-flex flex-column align-items-center justify-content-center"
            style={{ height: "80%" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: colors.primary,
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="white"
                />
                <path
                  d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
                  fill="white"
                />
                <path
                  d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                  fill="white"
                />
              </svg>
            </div>
            <h2 className="h5 fw-bold mb-2" style={{ color: colors.secondary }}>
              Trendyol Asistan'a Hoş Geldiniz!
            </h2>
            <p className="text-muted mb-4" style={{ maxWidth: "300px" }}>
              Size nasıl yardımcı olabilirim? Ürün önerisi veya diğer
              sorularınız için bana yazabilirsiniz.
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {[
                "İphone 16 Pro Max",
                "Kadın ayakkabı önerisi",
                "Siparişimi iptal etmek istiyorum",
                "Kargo takip numarası nasıl öğrenilir?",
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "white",
                    color: colors.primary,
                    border: `1px solid ${colors.primary}`,
                    borderRadius: "20px",
                    fontSize: "12px",
                    padding: "4px 12px",
                  }}
                  onClick={() => {
                    setMessage(suggestion);
                    inputRef.current.focus();
                  }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`d-flex mb-3 ${
                msg.type === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded ${
                  msg.type === "user"
                    ? "text-white"
                    : msg.type === "error"
                    ? "text-white"
                    : "text-dark"
                }`}
                style={{
                  maxWidth: "85%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  backgroundColor:
                    msg.type === "user"
                      ? colors.primary
                      : msg.type === "error"
                      ? colors.error
                      : "white",
                  borderRadius:
                    msg.type === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  boxShadow:
                    msg.type === "assistant"
                      ? "0 2px 8px rgba(0, 0, 0, 0.08)"
                      : msg.type === "user"
                      ? `0 2px 8px ${colors.primary}40`
                      : "none",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
                role={msg.type === "error" ? "alert" : undefined}
              >
                {msg.text}
                {msg.url && (
                  <motion.a
                    href={msg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-block mt-2 btn btn-sm text-white w-100 text-center"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Ürünleri görüntüle"
                  >
                    Ürünleri Gör
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-start mb-3"
            aria-live="assertive"
            aria-busy="true"
            aria-label="Asistan yazıyor"
          >
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "white",
                borderRadius: "18px 18px 18px 4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span style={{ fontSize: "12px", color: colors.secondary }}>
                  Yazıyor...
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Mesaj Giriş Alanı */}
      <footer
        style={{
          background: "white",
          borderTop: `1px solid rgba(0, 0, 0, 0.08)`,
          padding: "12px 16px",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) handleMessage();
          }}
          className="d-flex align-items-center gap-2 position-relative"
          role="form"
          aria-label="Mesaj gönderme formu"
        >
          <textarea
            ref={inputRef}
            id="user_message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Merhaba, nasıl yardımcı olabilirim?"
            className="form-control flex-grow-1"
            style={{
              height: "auto",
              minHeight: "44px",
              maxHeight: "120px",
              resize: "none",
              borderRadius: "12px",
              padding: "10px 16px",
              fontSize: "14px",
              border: `1px solid rgba(0, 0, 0, 0.1)`,
              boxShadow: "none",
              transition: "all 0.2s ease",
            }}
            aria-multiline="true"
            aria-describedby="send_button"
            disabled={isLoading}
            spellCheck={false}
            rows="1"
          />
          <motion.button
            type="submit"
            id="send_button"
            disabled={isLoading || !message.trim()}
            className="btn d-flex align-items-center justify-content-center position-absolute"
            style={{
              right: "8px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: message.trim() ? colors.primary : "#cccccc",
              color: "white",
              border: "none",
              padding: 0,
            }}
            whileHover={{ scale: message.trim() ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() ? 0.95 : 1 }}
            aria-label="Mesajı gönder"
          >
            <FiSend size={20} />
          </motion.button>
        </form>
        <p
          className="text-center mt-2 mb-0"
          style={{ fontSize: "11px", color: "#666" }}
        >
          Trendyol Asistan size daha iyi hizmet sunabilmek için sürekli
          öğreniyor.
        </p>
      </footer>

      {/* Stil */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          height: 17px;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: ${colors.secondary};
          border-radius: 50%;
          display: inline-block;
          opacity: 0.4;
        }
        .typing-indicator span:nth-child(1) {
          animation: typing 1s infinite;
        }
        .typing-indicator span:nth-child(2) {
          animation: typing 1s infinite 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation: typing 1s infinite 0.4s;
        }
        @keyframes typing {
          0% {
            opacity: 0.4;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
