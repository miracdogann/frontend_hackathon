import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../baseUrl";

export default function CommentAi({ setActiveComponent, activeComponent }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const analyzeProduct = async () => {
    if (!url.startsWith("https://www.trendyol.com/")) {
      setError(
        "Lütfen geçerli bir Trendyol URL'si girin (https://www.trendyol.com/ ile başlamalı)."
      );
      return;
    }
    setLoading(true);
    setResponse(null);
    setError("");

    try {
      const res = await axios.post(`${baseUrl}/api/analiz`, { url });
      setResponse(res.data);
    } catch (err) {
      setError("Bir hata oluştu: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[700px] w-[550px] bg-white dark:bg-gray-900 rounded-xl shadow-xl font-sans overflow-hidden transition-opacity duration-300">
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

      {/* İçerik */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800 space-y-4 text-sm text-gray-900 dark:text-white">
        {/* Hata */}
        {error && (
          <div className="p-2 bg-red-100 text-red-800 rounded-md">{error}</div>
        )}
        {/* Yükleniyor */}
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Analiz ediliyor...
            </span>
          </div>
        )}
        {/* Sonuçlar */}
        {response && !loading && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-semibold text-orange-600 mb-2">
                Ürün Sayfası
              </h3>
              <a
                href={response.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all hover:text-blue-700 transition-colors"
              >
                {response.product_url}
              </a>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-semibold text-orange-600 mb-2">
                Yorum Özeti
              </h3>
              <div
                className="mt-2 text-gray-700 dark:text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: response.summary.replace(/\n/g, "<br>"),
                }}
              />
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-semibold text-orange-600 mb-2">
                Yorumlar
              </h3>
              <div className="mt-2 space-y-3 max-h-40 overflow-y-auto">
                {response.raw_comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-gray-800 dark:text-gray-100">
                      {comment}
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
          placeholder="https://www.trendyol.com/ ile başlayan ürün linki girin"
          className="text-sm p-2 rounded-lg border w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          disabled={loading}
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
