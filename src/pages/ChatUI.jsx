import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiSend } from "react-icons/fi";
import { baseUrl } from "../../baseUrl";

export default function ChatUI({ setActiveComponent, activeComponent }) {
  const [personFile, setPersonFile] = useState(null);
  const [clothFile, setClothFile] = useState(null);
  const [previewPerson, setPreviewPerson] = useState(null);
  const [previewCloth, setPreviewCloth] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [instructions, setInstructions] = useState("");

  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const personInputRef = useRef(null);
  const clothInputRef = useRef(null);

  // Scroll to bottom when new responses or previews are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [responses, previewPerson, previewCloth]);

  // Handle person image selection
  const handlePersonChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonFile(file);
      setPreviewPerson(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle cloth image selection
  const handleClothChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClothFile(file);
      setPreviewCloth(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle form submission
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!personFile || !clothFile || loading) {
      setError("Lütfen hem kişi hem kıyafet görselini yükleyin.");
      return;
    }
    setLoading(true);
    setIsTyping(true);
    setError(null);

    const formData = new FormData();
    formData.append("person_image", personFile);
    formData.append("cloth_image", clothFile);
    formData.append("instructions", instructions);

    try {
      const response = await axios.post(`${baseUrl}/api/tryon/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { image, text } = response.data;

      if (!image) {
        throw new Error("AI'dan görüntü alınamadı.");
      }

      const base64Image = image.startsWith("data:image")
        ? image
        : `data:image/png;base64,${image}`;

      setTimeout(() => {
        setIsTyping(false);
        setResponses((prev) => [
          ...prev,
          {
            productImage: previewCloth,
            image: base64Image,
            text: "AI tarafından oluşturulan sanal giydirme.",
            id: Date.now(),
          },
        ]);

        // Reset inputs
        setPersonFile(null);
        setClothFile(null);
        setPreviewPerson(null);
        setPreviewCloth(null);
        personInputRef.current.value = "";
        clothInputRef.current.value = "";
      }, 1500);
    } catch (err) {
      console.error("Yükleme hatası:", err);
      setIsTyping(false);
      // Fallback mock response for testing
      const mockResponse = {
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        text: "API bulunamadı, bu bir test görüntüsüdür.",
      };
      setTimeout(() => {
        setResponses((prev) => [
          ...prev,
          {
            productImage: previewCloth,
            image: mockResponse.image,
            text: `Hata: API bulunamadı (${err.message}). Test görüntüsü gösteriliyor.`,
            id: Date.now(),
          },
        ]);
        setPersonFile(null);
        setClothFile(null);
        setPreviewPerson(null);
        setPreviewCloth(null);
        personInputRef.current.value = "";
        clothInputRef.current.value = "";
      }, 1500);
      setError(`API hatası: ${err.message || "Sunucuya ulaşılamadı."}`);
    } finally {
      setLoading(false);
    }
  };

  // Trendyol color palette
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
        width: "430px",
        height: "630px",
        backgroundColor: "#fff",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        border: `1px solid rgba(0, 0, 0, 0.08)`,
      }}
      role="region"
      aria-label="Trendyol Sanal Giydirme"
    >
      {/* Header */}
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
            Sanal Giydirme
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

      {/* Main Content */}
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
        {/* Welcome Message */}
        {responses.length === 0 &&
          !previewPerson &&
          !previewCloth &&
          !error && (
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
                <FiUpload size={40} color="white" />
              </div>
              <h2
                className="h5 fw-bold mb-2"
                style={{ color: colors.secondary }}
              >
                Sanal Giydirme'ye Hoş Geldiniz!
              </h2>
              <p className="text-muted mb-4" style={{ maxWidth: "300px" }}>
                Kişi ve kıyafet görsellerini yükleyerek AI ile sanal giydirme
                yapabilirsiniz.
              </p>
            </motion.div>
          )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-start mb-3"
          >
            <div
              className="p-3 rounded text-white"
              style={{
                maxWidth: "85%",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                backgroundColor: colors.error,
                borderRadius: "18px 18px 18px 4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              role="alert"
            >
              {error}
            </div>
          </motion.div>
        )}

        {/* Preview Images */}
        {(previewPerson || previewCloth) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3"
          >
            {previewPerson && (
              <div className="mb-2">
                <p
                  className="mb-1"
                  style={{ fontSize: "14px", color: colors.secondary }}
                >
                  Kişi Fotoğrafı:
                </p>
                <img
                  src={previewPerson}
                  alt="Kişi"
                  style={{
                    maxWidth: "50%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                  onError={() => setError("Kişi görseli yüklenemedi.")}
                />
              </div>
            )}
            {previewCloth && (
              <div>
                <p
                  className="mb-1"
                  style={{ fontSize: "14px", color: colors.secondary }}
                >
                  Kıyafet Fotoğrafı:
                </p>
                <img
                  src={previewCloth}
                  alt="Kıyafet"
                  style={{
                    maxWidth: "50%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                  onError={() => setError("Kıyafet görseli yüklenemedi.")}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Responses */}
        <AnimatePresence>
          {responses.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="d-flex justify-content-start mb-3"
            >
              <div
                className={`p-3 rounded ${
                  item.type === "error" ? "text-white" : "text-dark"
                }`}
                style={{
                  maxWidth: "60%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  backgroundColor:
                    item.type === "error" ? colors.error : "white",
                  borderRadius: "18px 18px 18px 4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
                role={item.type === "error" ? "alert" : undefined}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt="AI giydirme sonucu"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                    onError={() => setError("Sonuç görseli yüklenemedi.")}
                  />
                )}
                {item.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-start mb-3"
            aria-live="assertive"
            aria-busy="true"
            aria-label="AI işliyor"
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
                  İşliyor...
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer with Form */}
      <footer
        style={{
          background: "white",
          borderTop: `1px solid rgba(0, 0, 0, 0.08)`,
          padding: "12px 16px",
        }}
      >
        <form
          onSubmit={handleUpload}
          className="d-flex flex-column gap-2"
          role="form"
          aria-label="Sanal giydirme formu"
        >
          <div className="d-flex gap-2">
            <div className="flex-grow-1">
              <input
                type="file"
                accept="image/*"
                ref={personInputRef}
                onChange={handlePersonChange}
                className="form-control"
                style={{
                  fontSize: "12px",
                  borderRadius: "12px",
                  padding: "8px",
                }}
                aria-label="Kişi fotoğrafı yükle"
              />
            </div>
            <div className="flex-grow-1">
              <input
                type="file"
                accept="image/*"
                ref={clothInputRef}
                onChange={handleClothChange}
                className="form-control"
                style={{
                  fontSize: "12px",
                  borderRadius: "12px",
                  padding: "8px",
                }}
                aria-label="Kıyafet fotoğrafı yükle"
              />
            </div>
          </div>
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Talimat (örn: Gömleği düzgünce giydir)"
            className="form-control"
            style={{
              fontSize: "12px",
              borderRadius: "12px",
              padding: "8px 14px",
              border: `1px solid rgba(0, 0, 0, 0.1)`,
            }}
            aria-label="Giydirme talimatı"
          />

          <motion.button
            type="submit"
            disabled={loading || !personFile || !clothFile}
            className="btn d-flex align-items-center justify-content-center"
            style={{
              backgroundColor:
                personFile && clothFile ? colors.primary : "#cccccc",
              color: "white",
              borderRadius: "12px",
              fontSize: "14px",
              padding: "10px",
            }}
            whileHover={{ scale: personFile && clothFile ? 1.05 : 1 }}
            whileTap={{ scale: personFile && clothFile ? 0.95 : 1 }}
            aria-label="Gönder"
          >
            <FiSend size={20} className="me-2" />
            {loading ? "Yükleniyor..." : "Gönder"}
          </motion.button>
        </form>
        <p
          className="text-center mt-2 mb-0"
          style={{ fontSize: "11px", color: "#666" }}
        >
          Trendyol Sanal Giydirme AI ile desteklenmektedir.
        </p>
      </footer>

      {/* Styles */}
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
