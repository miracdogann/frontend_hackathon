import React, { useState } from "react";
import axios from "axios";

export default function ChatSefa() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [comments, setComments] = useState([]);
  const [emotionStats, setEmotionStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeProduct = async () => {
    setLoading(true);
    setSummary("");
    setComments([]);
    setEmotionStats(null);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/analyze/?url=${encodeURIComponent(url)}`
      );
      setSummary(res.data.summary);
      setComments(res.data.raw_comments);
      setEmotionStats(res.data.emotions);
    } catch (err) {
      setSummary("Bir hata oluştu: " + err.message);
    }

    setLoading(false);
  };

  const renderEmotionBar = () => {
    if (!emotionStats) return null;

    return (
      <div className="mt-6 space-y-3">
        {Object.entries(emotionStats).map(([emotion, percent]) => (
          <div key={emotion}>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span className="capitalize">{emotion}</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  emotion === "happy"
                    ? "bg-green-500"
                    : emotion === "neutral"
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-6">
          🛒 Trendyol Ürün Yorum Analizi
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ürün URL'sini girin (örn: trendyol.com/...)"
            className="w-full border border-gray-300 p-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={analyzeProduct}
            className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition"
          >
            Analiz Et
          </button>
        </div>

        {loading && (
          <p className="text-center mt-6 text-teal-600 animate-pulse">
            ⏳ Yükleniyor, lütfen bekleyin...
          </p>
        )}

        {summary && (
          <div className="mt-10 bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">
              🤖 Yapay Zeka Özeti
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
            {renderEmotionBar()}
          </div>
        )}

        {comments.length > 0 && (
          <div className="mt-10">
            <h4 className="text-xl font-semibold mb-4 text-gray-800">
              💬 Kullanıcı Yorumları ({comments.length})
            </h4>

            {/* Scrollable container */}
            <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid sm:grid-cols-2 gap-4">
                {comments.map((c, i) => {
                  const [text, emotionLine] = c.split("\n👉 ");
                  return (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
                    >
                      <p className="text-gray-900">{text}</p>
                      {emotionLine && (
                        <p className="mt-2 text-sm text-gray-500">
                          👉 {emotionLine}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
