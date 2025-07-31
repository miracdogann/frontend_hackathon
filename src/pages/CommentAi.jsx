import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { baseUrl } from "../../baseUrl";

export default function CommentAi({ setActiveComponent, activeComponent }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

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

  const analyzeProduct = async () => {
    if (!url.startsWith("https://www.trendyol.com/")) {
      setError(
        "Lütfen geçerli bir Trendyol URL'si girin (https://www.trendyol.com/ ile başlamalı)."
      );
      return;
    }

    setIsLoading(true);
    setIsTyping(true);
    setResponse(null);
    setError("");

    try {
      const res = await axios.post(`${baseUrl}/api/analiz`, { url });

      // Yapay yazma efekti için gecikme ekliyoruz
      setTimeout(() => {
        setIsTyping(false);
        setResponse(res.data);
      }, 1500);
    } catch (err) {
      setIsTyping(false);
      setError(
        "Bir hata oluştu: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
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
      aria-label="Trendyol Yorum Analiz Asistanı"
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
          >
            Trendyol Yorum Analiz
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

      {/* İçerik */}
      <main
        className="flex-grow-1 p-4 overflow-auto"
        style={{ backgroundColor: colors.light }}
      >
        {/* Hoş geldin mesajı */}
        {!response && !isLoading && !error && (
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
              Ürün Yorum Analizi
            </h3>
            <p className="text-muted mb-4" style={{ maxWidth: "300px" }}>
              Trendyol ürün sayfasının URL'sini girerek yorum analizi
              yapabilirsiniz.
            </p>
          </motion.div>
        )}

        {/* Hata */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-danger p-3 mb-4"
            role="alert"
            style={{
              borderRadius: "12px",
              borderLeft: `4px solid ${colors.error}`,
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.error}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Yükleniyor */}
        {isLoading && (
          <div className="d-flex justify-content-center align-items-center h-100 gap-3">
            {isTyping ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="d-flex align-items-center gap-2 p-3 bg-white rounded"
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span style={{ fontSize: "14px", color: colors.secondary }}>
                  Analiz ediliyor...
                </span>
              </motion.div>
            ) : (
              <>
                <div
                  className="spinner-border text-warning"
                  role="status"
                  aria-label="Analiz ediliyor"
                  style={{ width: "2rem", height: "2rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-secondary">
                  Yorumlar analiz ediliyor...
                </span>
              </>
            )}
          </div>
        )}

        {/* Sonuçlar */}
        {response && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex flex-column gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-4 rounded"
              style={{
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                border: `1px solid rgba(0, 0, 0, 0.05)`,
              }}
            >
              <h3 className="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span style={{ color: colors.primary }}>Ürün Sayfası</span>
              </h3>
              <a
                href={response.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-break text-decoration-none"
                style={{ color: colors.secondary }}
              >
                {response.product_url}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-4 rounded"
              style={{
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                border: `1px solid rgba(0, 0, 0, 0.05)`,
              }}
            >
              <h3 className="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span style={{ color: colors.primary }}>Yorum Özeti</span>
              </h3>
              <div
                className="text-dark"
                style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}
                dangerouslySetInnerHTML={{
                  __html: response.summary.replace(/\n/g, "<br>"),
                }}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-4 rounded"
              style={{
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                border: `1px solid rgba(0, 0, 0, 0.05)`,
              }}
            >
              <h3 className="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span style={{ color: colors.primary }}>Yorumlar</span>
              </h3>
              <div className="overflow-auto" style={{ maxHeight: "200px" }}>
                {response.raw_comments.map((comment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded mb-3"
                    style={{
                      backgroundColor: colors.light,
                      wordBreak: "break-word",
                      borderLeft: `3px solid ${colors.primary}`,
                    }}
                  >
                    {comment}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Giriş Alanı */}
      <footer className="p-4" style={{ backgroundColor: "white" }}>
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
              aria-label="Trendyol ürün linki"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                border: `1px solid rgba(0, 0, 0, 0.1)`,
                boxShadow: "none",
              }}
            />
          </motion.div>

          <motion.button
            onClick={analyzeProduct}
            disabled={isLoading || !url}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              backgroundColor: colors.primary,
              color: "white",
              borderRadius: "12px",
              padding: "12px 16px",
              fontWeight: 600,
              border: "none",
              opacity: !url || isLoading ? 0.7 : 1,
            }}
            whileHover={{
              scale: !url || isLoading ? 1 : 1.03,
            }}
            whileTap={{
              scale: !url || isLoading ? 1 : 0.98,
            }}
            aria-label="Ürünü analiz et"
            type="button"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Analiz Ediliyor...</span>
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Ürünü Analiz Et</span>
              </>
            )}
          </motion.button>
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
