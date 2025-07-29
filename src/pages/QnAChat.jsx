// frontend/src/pages/QnAChat.jsx

import React, { useState } from "react";
import axios from "axios";

export default function QnAChat() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!url || !question) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.get("http://localhost:8000/api/qna/", {
        params: { url, question },
      });
      setAnswer(res.data.ai_answer);
    } catch (err) {
      setAnswer("Hata: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          🛍️ Ürün Soru & Cevap Asistanı
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🛒 Trendyol Ürün URL’si
            </label>
            <input
              type="text"
              placeholder="https://www.trendyol.com/..."
              className="w-full border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-3 rounded-lg shadow-sm text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ❓ Sorunuzu Yazın
            </label>
            <input
              type="text"
              placeholder="Ürün kargo süresi nedir?"
              className="w-full border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-3 rounded-lg shadow-sm text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={askQuestion}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "⏳ Yanıtlanıyor..." : "🔍 Cevabı Al"}
            </button>
          </div>
        </div>

        {answer && (
          <div className="mt-10 bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-inner">
            <h4 className="text-lg font-semibold text-indigo-800 mb-3">
              AI Yanıtı:
            </h4>
            <p className="text-gray-900 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
