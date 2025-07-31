import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function QnAChat({ setActiveComponent, activeComponent }) {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

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

  // Scroll otomatik aşağı kaydırma
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Soru sorma fonksiyonu
  const askQuestion = async () => {
    if ((!question.trim() && !url.trim()) || isLoading) return;

    // URL kontrolü
    if (url.trim() && !url.startsWith("https://www.trendyol.com/")) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "error",
          text: "Lütfen geçerli bir Trendyol URL'si girin (https://www.trendyol.com/ ile başlamalı).",
        },
      ]);
      return;
    }

    // Kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: question || url,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:8000/api/qna", {
        url,
        question,
      });

      // Yapay yazma efekti için gecikme ekliyoruz
      setTimeout(() => {
        setIsTyping(false);
        const { ai_answer, question: returnedQuestion } = res.data;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "assistant",
            text: `❓ ${returnedQuestion}\n\n💬 ${ai_answer}\n`,
          },
        ]);
      }, 1500);
    } catch (err) {
      setIsTyping(false);
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
      setIsLoading(false);
    }
  };

  // Enter ile gönderme, Shift+Enter ile alt satıra geçiş
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      askQuestion();
    }
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
      aria-label="Trendyol Soru-Cevap Asistanı"
    >
      {/* Başlık ve Butonlar */}
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
          <h2
            className="h5 fw-bold mb-0 text-white"
            style={{ letterSpacing: "0.5px" }}
            aria-live="polite"
            aria-atomic="true"
          >
            Trendyol Soru-Cevap Asistanı
          </h2>
        </div>
        <div
          className="btn-group"
          role="group"
          aria-label="Asistan seçim butonları"
        >
          {["asistan", "soru", "yorum"].map((key) => {
            const label =
              key === "asistan"
                ? "AI Asistan"
                : key === "soru"
                ? "Soru-Cevap"
                : "Yorum-Analiz";
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

      {/* Chat kutusu */}
      <main
        ref={chatRef}
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
            <h3 className="h5 fw-bold mb-2" style={{ color: colors.secondary }}>
              Trendyol Soru-Cevap Asistanı
            </h3>
            <p className="text-muted mb-4" style={{ maxWidth: "300px" }}>
              Ürünler hakkında sorularınızı yanıtlamak için buradayım. Ürün
              URL'si ve sorunuzu girerek başlayın.
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {[
                "Bu ürün su geçirir mi?",
                "Kargo ne zaman gelir?",
                "Ürünün boyutları nedir?",
                "Bu modelin farklı renkleri var mı?",
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
                    setQuestion(suggestion);
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
                {msg.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
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

      {/* Giriş Alanı */}
      <footer
        style={{
          background: "white",
          borderTop: `1px solid rgba(0, 0, 0, 0.08)`,
          padding: "16px",
        }}
      >
        <div className="d-flex flex-column gap-3">
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.trendyol.com/urun-url"
              className="form-control"
              disabled={isLoading}
              aria-label="Ürün URL'si"
              style={{
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "14px",
                border: `1px solid rgba(0, 0, 0, 0.1)`,
                boxShadow: "none",
              }}
            />
          </motion.div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading) askQuestion();
            }}
            className="d-flex flex-column gap-2"
          >
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ürünle ilgili sorunuzu yazın..."
                className="form-control"
                rows={3}
                disabled={isLoading}
                aria-label="Ürünle ilgili sorunuzu yazın"
                style={{
                  resize: "none",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  border: `1px solid rgba(0, 0, 0, 0.1)`,
                  boxShadow: "none",
                }}
              />
            </motion.div>

            <motion.button
              onClick={askQuestion}
              disabled={isLoading || (!question.trim() && !url.trim())}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                backgroundColor: colors.primary,
                color: "white",
                borderRadius: "12px",
                padding: "10px 16px",
                fontWeight: 600,
                border: "none",
                opacity:
                  (!question.trim() && !url.trim()) || isLoading ? 0.7 : 1,
              }}
              whileHover={{
                scale:
                  (!question.trim() && !url.trim()) || isLoading ? 1 : 1.03,
              }}
              whileTap={{
                scale:
                  (!question.trim() && !url.trim()) || isLoading ? 1 : 0.98,
              }}
              aria-label="Soruyu gönder"
              type="submit"
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>Soruyu Gönder</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
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
