document.addEventListener("DOMContentLoaded", async function() {
  const chatBot = document.querySelector(".chatbot-container");
  const chatToggle = document.querySelector("#chat-toggle");
  const closeChat = document.querySelector(".close-chat");
  const chatBody = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const suggestionsContainer = document.getElementById("chat-suggestions");
  
  let botData = {};
  
  // Ambil Data dari JSON
  async function loadBotData() {
    try {
      let response = await fetch("data.json");
      botData = await response.json();
    } catch (error) {
      console.error("Gagal memuat data chatbot:", error);
    }
  }
  
  await loadBotData();
  
  // Event open chat
  chatToggle.addEventListener("click", () => {
    chatBot.style.display = "flex";
    setTimeout(() => {
      chatBot.classList.add("show");
    }, 10);
    chatToggle.style.display = "none";
  });
  
  // Event close chat
  closeChat.addEventListener("click", () => {
    chatBot.classList.remove("show");
    chatBot.classList.add("hide");
    setTimeout(() => {
      chatBot.style.display = "none";
      chatBot.classList.remove("hide");
      chatToggle.style.display = "flex";
    }, 500);
  });
  
  // Fungsi kirim pesan
  function sendMessage() {
    let userText = chatInput.value.trim().toLowerCase();
    if (userText === "") return;
    
    addChatMessage(userText, "user");
    chatInput.value = "";
    
    setTimeout(() => {
      let botReply = generateBotReply(userText);
      addChatMessage(botReply, "bot");
      if (userText.includes("admin")) showAdminLinks();
    }, 1000);
  }
  
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
  
  function addChatMessage(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function generateBotReply(text) {
    let reply = "Maaf, saya tidak mengerti. Coba tanyakan tentang fitur di web ini.";
    for (let key in botData.responses) {
      if (text.includes(key)) {
        reply = botData.responses[key];
        break;
      }
    }
    return reply;
  }
  
  function showAdminLinks() {
    let existingLinks = document.querySelector(".chat-links");
    if (existingLinks) existingLinks.remove();
    
    let chatLinksContainer = document.createElement("div");
    chatLinksContainer.className = "chat-links";
    for (let key in botData.links) {
      let { name, url, icon } = botData.links[key];
      let linkElement = document.createElement("a");
      linkElement.href = url;
      linkElement.className = "chat-button";
      linkElement.target = "_blank";
      
      let iconElement = document.createElement("i");
      iconElement.className = icon;
      
      let textElement = document.createElement("span");
      textElement.textContent = name;
      
      linkElement.appendChild(iconElement);
      linkElement.appendChild(textElement);
      chatLinksContainer.appendChild(linkElement);
    }
    
    chatBody.appendChild(chatLinksContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  const suggestions = ["Home", "Kontak", "Admin", "Fitur", "Cara Pakai"];
  
  function loadSuggestions() {
    suggestionsContainer.innerHTML = "";
    suggestions.forEach(text => {
      let suggestionElement = document.createElement("div");
      suggestionElement.className = "suggestion";
      suggestionElement.textContent = text;
      
      suggestionElement.addEventListener("click", function() {
        let userText = text.toLowerCase();
        addChatMessage(userText, "user");
        let botReply = generateBotReply(userText);
        setTimeout(() => {
          addChatMessage(botReply, "bot");
          if (userText.includes("admin")) showAdminLinks();
        }, 1000);
      });
      
      suggestionsContainer.appendChild(suggestionElement);
    });
  }
  
  loadSuggestions();
});