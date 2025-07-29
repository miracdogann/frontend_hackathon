import React, { useState } from "react";
import axios from "axios";

export default function CommentAi() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const analyzeProduct = async () => {
    setLoading(true);
    setResponse(null);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/analiz", { url });
      setResponse(res.data);
    } catch (err) {
      setError("Bir hata oluştu: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-white dark:bg-gray-900 rounded-xl shadow-xl font-sans overflow-hidden">
      {/* Başlık */}
      <div className="flex items-center p-3 bg-orange-500 text-white">
        <h2 className="text-lg font-semibold">Trendyol Asistan 🤖</h2>
      </div>

      {/* İçerik */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800 space-y-4 text-sm text-gray-900 dark:text-white">
        {/* Hata */}
        {error && (
          <div className="p-2 bg-red-100 text-red-800 rounded-md">{error}</div>
        )}

        {/* Yükleniyor */}
        {loading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Sonuçlar */}
        {response && (
          <div className="space-y-3">
            <div>
              <strong>Toplam Yorum:</strong> {response.comment_count}
            </div>

            <div>
              <strong>Ürün Sayfası:</strong>{" "}
              <a
                href={response.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                Ürünü Görüntüle
              </a>
            </div>

            <div>
              <strong>Hedef URL:</strong>{" "}
              <a
                href={response.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                Hedef Sayfa
              </a>
            </div>

            <div>
              <strong>Yorum Özeti:</strong>
              <p className="mt-1 bg-white dark:bg-gray-700 p-2 rounded-md border text-sm">
                {response.summary}
              </p>
            </div>

            <div>
              <strong>Duygu Dağılımı:</strong>
              <div className="space-y-2 mt-2">
                {Object.entries(response.emotion_stats).map(
                  ([emotion, percent]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>{emotion}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            emotion === "happy"
                              ? "bg-green-500"
                              : emotion === "neutral"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <strong>Yorumlar:</strong>
              <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
                {response.raw_comments.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-700 border rounded-md p-2 text-sm"
                  >
                    <p>{item.text}</p>
                    <p className="text-xs text-gray-500">
                      Duygu: {item.emotion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Giriş Alanı */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ürün URL'sini yapıştırın..."
          className="text-sm p-2 rounded-lg border w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          onClick={analyzeProduct}
          disabled={loading || !url}
          className="mt-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed w-full"
        >
          Ürünü Analiz Et
        </button>
      </div>
    </div>
  );
}
