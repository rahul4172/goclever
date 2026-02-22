// Replace your handleSendMessage function with:
async function handleSendMessage() {
  const text = typingInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  typingInput.value = "";

  const loading = document.createElement("div");
  loading.className = "message bot-msg";
  loading.innerText = "✈️ Finding travel options...";
  chatList.appendChild(loading);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Mega-Bot, a helpful travel assistant. Provide concise, practical information about transportation."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    loading.remove();
    
    if (data.error) {
      addMessage("Error: " + (data.error.message || "Unknown error"), "bot");
    } else if (data.choices && data.choices[0]) {
      addMessage(data.choices[0].message.content, "bot");
    } else {
      addMessage("Sorry, I couldn't generate a response.", "bot");
    }
    
  } catch (error) {
    loading.remove();
    addMessage("Network error: " + error.message, "bot");
  }
}

// Update your testAPI function similarly
async function testAPI() {
  try {
    addMessage("Testing API connection...", "bot");
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Say 'Hello, I'm working!' if you can read this."
          }
        ],
        max_tokens: 50
      })
    });

    const data = await response.json();
    console.log("API Response:", data);
    
    if (data.error) {
      addMessage("API Error: " + JSON.stringify(data.error), "bot");
    } else if (data.choices && data.choices[0]) {
      addMessage("✅ Success! " + data.choices[0].message.content, "bot");
    } else {
      addMessage("Unexpected response: " + JSON.stringify(data), "bot");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    addMessage("Connection Error: " + error.message, "bot");
  }
}
