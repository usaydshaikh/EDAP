
// flash message timout
setTimeout(function () {
  const alert = document.querySelector('.alert');
  if (alert) {
      alert.classList.remove('show');
  }
}, 2000); // Timeout after 10 seconds

document.addEventListener("DOMContentLoaded", () => {
    // Apply saved theme from localStorage
    const body = document.body;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
    }
  
    // DARK/LIGHT MODE TOGGLE: on logo click
    const toggleBtn = document.getElementById("toggleDarkModeBtn");
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      body.classList.toggle("light-mode");
      localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    });
  
    // SLIDESHOW
    const slideshowImg = document.getElementById("slideshowImg");
    const slidesData = [
      "assets/Slideshow/1.jpeg",
      "assets/Slideshow/2.jpeg",
      "assets/Slideshow/3.jpeg",
      "assets/Slideshow/4.jpeg",
      "assets/Slideshow/5.jpeg",
      "assets/Slideshow/6.jpeg",
      "assets/Slideshow/7.jpeg"
    ];
    let index = 0;
    setInterval(() => {
      index = (index + 1) % slidesData.length;
      slideshowImg.src = slidesData[index];
    }, 5000);
  
    // SEARCH FUNCTIONALITY: Single search bar with prompt for search type
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    searchBtn.addEventListener("click", () => {
      let query = searchInput.value.trim();
      if (!query) {
        alert("Please enter a search term.");
        return;
      }
      let choice = prompt("Enter:\n1 for AI Search\n2 for Google Search\n3 for Site Search");
      if (!choice) return;
      choice = choice.toLowerCase();
      if (choice.includes("1") || choice.includes("ai")) {
        openAiSearch(query);
      } else if (choice.includes("2") || choice.includes("google")) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
      } else if (choice.includes("3") || choice.includes("site")) {
        alert(`Site search for "${query}" is coming soon.`);
      } else {
        alert("Invalid choice. Please try again.");
      }
    });
  
    // Function to open AI modal and display custom Google search results in the chat window
    function openAiSearch(query) {
      const aiModal = document.getElementById("aiModal");
      aiModal.style.display = "flex";
      appendChatMessage("ai", `Searching for "${query}"...`);
      setTimeout(() => {
        let resultsHTML = `<p><a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank">Google Search Results for "${query}"</a></p>`;
        appendChatMessage("ai", resultsHTML);
      }, 1500);
    }
     
  
    // LANGUAGE TOGGLE
    const langToggleBtn = document.getElementById("langToggleBtn");
    langToggleBtn.addEventListener("click", () => {
      let current = langToggleBtn.textContent;
      let newLang = current === "EN" ? "ES" : "EN";
      langToggleBtn.textContent = newLang;
      alert(`Language toggled to ${newLang}`);
    });
  
    // SIGN-IN MODAL TOGGLE
    const signInBtn = document.getElementById("signInBtn");
    const authModal = document.getElementById("authModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    signInBtn.addEventListener("click", () => authModal.classList.add("active"));
    closeModalBtn.addEventListener("click", () => authModal.classList.remove("active"));
  
    // AUTH TABS TOGGLE
    const authTabs = document.querySelectorAll(".auth-tab");
    const authForms = document.querySelectorAll(".auth-form");
    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        authTabs.forEach(t => t.classList.remove("active"));
        authForms.forEach(f => f.classList.add("hidden"));
        tab.classList.add("active");
        const target = tab.getAttribute("data-tab");
        document.getElementById(target).classList.remove("hidden");
      });
    });
  
    // AI HELP MODAL TOGGLE
    const aiHelpBtn = document.getElementById("aiHelpBtn");
    const aiModalEl = document.getElementById("aiModal");
    const closeAiBtn = document.getElementById("closeAiBtn");
    aiHelpBtn.addEventListener("click", () => aiModalEl.style.display = "flex");
    closeAiBtn.addEventListener("click", () => aiModalEl.style.display = "none");
  
    // AI HELP SEND BUTTON
    document.getElementById("aiSendBtn").addEventListener("click", () => {
      const aiInput = document.getElementById("aiInput");
      let inputText = aiInput.value.trim();
      if (!inputText) {
        alert("Please enter a query.");
        return;
      }
      appendChatMessage("user", inputText);
      aiInput.value = "";
      
      // If input starts with "search for", perform custom Google search inside chat window
      if (/^search for\s+(.+)/i.test(inputText)) {
        let match = inputText.match(/^search for\s+(.+)/i);
        let query = match[1];
        appendChatMessage("ai", `Searching for "${query}"...`);
        setTimeout(() => {
          let resultsHTML = `<p><a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank">Google Search Results for "${query}"</a></p>`;
          appendChatMessage("ai", resultsHTML);
        }, 1500);
      } else {
        setTimeout(() => {
          appendChatMessage("ai", "I'm here to help!");
        }, 1000);
      }
    });
  
  
    
    // Utility: Append message to chat window
    function appendChatMessage(sender, message) {
      const chatWindow = document.getElementById("chatWindow");
      const div = document.createElement("div");
      div.className = `chat-message ${sender}`;
      div.innerHTML = message;
      chatWindow.appendChild(div);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  });
  