if (!document.getElementById("trendyol-asistan-root")) {
  const container = document.createElement("div");
  container.id = "trendyol-asistan-root";
  document.body.appendChild(container);

  // Temel stil, geri kalanını React'e bırak
  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "450px",
    height: "750px",
    zIndex: "99999",
    background: "#ffffff", // Beyaz arka plan, stil çakışmasını önler
    borderRadius: "25px",
    overflow: "hidden",
    boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
  });

  console.log("Container created, loading asistan-ui.js...");

  setTimeout(() => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("asistan-ui.js");
    script.type = "module";
    script.onload = () => console.log("asistan-ui.js loaded successfully");
    script.onerror = () => console.error("Failed to load asistan-ui.js");
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = chrome.runtime.getURL('assets/index.css'); // index.css'i hedefle
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.onload = () => console.log("index.css loaded successfully");
    link.onerror = () => console.error("Failed to load index.css");
    document.head.appendChild(link);
  }, 200); // Gecikmeyi biraz artırdık
}