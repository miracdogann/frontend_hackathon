if (!document.getElementById("trendyol-asistan-root")) {
  // Check if the URL is from Trendyol
  if (window.location.href.includes('trendyol.com')) {
    // Main container
    const container = document.createElement("div");
    container.id = "trendyol-asistan-root";
    container.style.display = "none";
    
    Object.assign(container.style, {
      position: "fixed",
      bottom: "25px",
      right: "30px",
      width: "430px",
      height: "630px",
      zIndex: "99998",
      background: "#ffffff",
      borderRadius: "25px",
      overflow: "hidden",
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
      display: "none",
      flexDirection: "column",
      transform: "translateY(20px)",
      opacity: "0",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    });

    // Toggle button
    const toggleButton = document.createElement("div");
    toggleButton.id = "trendyol-asistan-toggle";
    
    Object.assign(toggleButton.style, {
      position: "fixed",
      bottom: "5px",
      right: "5px",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#ff7000",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: "99999",
      boxShadow: "0 4px 12px rgba(242, 122, 26, 0.3)",
      border: "none",
      transition: "all 1s ease",
    });

    // Button hover effects
    toggleButton.onmouseenter = () => {
      toggleButton.style.transform = "scale(1.1)";
      toggleButton.style.boxShadow = "0 6px 16px rgba(242, 122, 26, 0.4)";
    };
    
    toggleButton.onmouseleave = () => {
      toggleButton.style.transform = "scale(1)";
      toggleButton.style.boxShadow = "0 4px 12px rgba(242, 122, 26, 0.3)";
    };

    // Button icon (SVG)
   const imageUrl = chrome.runtime.getURL('assets/chatbot.png');
  
  // Set button content with the image
  toggleButton.innerHTML = `
    <img src="${imageUrl}" alt="Asistan" style="
      width: 30px;
      height: 30px;
      object-fit: contain;
      pointer-events: none;
    ">
  `;

    // Toggle function with animations
    let isOpen = false;
    toggleButton.onclick = () => {
      if (!isOpen) {
        // Open animation
        container.style.display = "flex";
        setTimeout(() => {
          container.style.transform = "translateY(0)";
          container.style.opacity = "1";
        }, 10);
        
        // Button animation
        toggleButton.style.transform = "scale(0.8)";
        setTimeout(() => {
          toggleButton.style.transform = "scale(1)";
        }, 200);
      } else {
        // Close animation
        container.style.transform = "translateY(20px)";
        container.style.opacity = "0";
        setTimeout(() => {
          container.style.display = "none";
        }, 300);
        
        // Button animation
        toggleButton.style.transform = "scale(1.2)";
        setTimeout(() => {
          toggleButton.style.transform = "scale(1)";
        }, 200);
      }
      isOpen = !isOpen;
    };

    document.body.appendChild(container);
    document.body.appendChild(toggleButton);

    // Load the UI script and CSS
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("asistan-ui.js");
      script.type = "module";
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.href = chrome.runtime.getURL('assets/index.css');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }, 200);
  }
}