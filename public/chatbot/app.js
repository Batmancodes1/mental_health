/* ========= MindCare — Frontend JS =========
   1) Put your Google API key below.
   2) Open index.html in a browser.
   3) That’s it.
=========================================== */

const API_KEY = "AIzaSyCCg6dXT36VXw44iJlUP_PzI0hHBRDDTGU"; // <- Replace with your key
const MODEL = "gemini-1.5-flash"; // fast + good for chat UX
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Conversation memory for better context
const history = []; // will store {role: "user"|"model", text: string}

const systemPrompt = `
You are a digital mental health support assistant for students.

- Understand the user's input, even with spelling mistakes or if they write in another language.

- If the input is related to mental health (stress, depression, loneliness, anxiety, burnout, sadness, etc.), respond in a warm, empathetic, and human-like way with useful coping suggestions.

- If the input is off-topic (sports, politics, random questions), reply with: "Please talk about your issues or problems that you’re facing or similar."

- Detect language automatically and respond in the same language.

- Always keep responses short, clear, and supportive.

- Your chatbot name is MindCare. Introduce yourself as MindCare at the start only.

- At the start, ask the user’s name and ask if they also want to share more details about themselves. If they say yes, then ask about their college, age, and working profession, and behave like a human. Don’t ask again if they say no. Do not repeat the question or ask again—move on until they mention they want to tell you.

- If the user says things like "no one will listen to me", "what to do", "whom to contact", or "I want to end everything" then:

Give them 2 options:  

OPTION 1  
1. Try to communicate with them, understand their problem, and give them good advice.  
2. Provide suicide prevention and mental health helpline numbers only when they ask whom to contact, ask for support, ask whom to reach, or ask for numbers:  
   - India: Vandrevala Foundation Helpline 1860 266 2345 / AASRA 91-22-27546669  
   - If outside these regions: encourage calling the local emergency number or the nearest mental health helpline from our website features.  

OPTION 2  
- If the user shows interest in what to do, then guide them towards exploring the features of our website:  
  - Peer-to-peer support system  
  - NGO groups for mental health  
  - Safe space to talk anonymously with others  
  - Self-help resources and coping strategies  

- Always be compassionate, calm, and non-judgmental in responses.

Always remember: You are not here to replace human professionals — you are here to bridge the gap between struggle and professional care, while providing comfort and actionable support.
`.trim();

// ---------- UI helpers ----------
const chatEl = document.getElementById("chat");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("status");

function addBubble(text, who = "bot") {
  const row = document.createElement("div");
  row.className = "row " + (who === "bot" ? "left" : "right");

  const avatar = document.createElement("div");
  avatar.className = "avatar";

  const bubble = document.createElement("div");
  bubble.className = "bubble " + (who === "bot" ? "bot" : "user");
  bubble.textContent = text;

  if (who === "bot") {
    row.appendChild(avatar);
    row.appendChild(bubble);
  } else {
    row.appendChild(bubble);
    row.appendChild(avatar);
  }

  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function setLoading(loading) {
  sendBtn.disabled = loading;
  statusEl.innerHTML = loading
    ? `<span class="loading" aria-hidden="true"></span> MindCare is thinking…`
    : "";
}

function seedGreeting() {
  const opening = `Hi, I’m MindCare. What would you like me to call you? If you want, I can also listen with a bit more context. Would you like to share your college, age, and what you’re working on?`;
  addBubble(opening, "bot");
  history.push({ role: "model", text: opening });
}

// ---------- API call ----------
async function callGemini(userText) {
  const contents = [];

  // System instruction (as first "model" message to guide behavior)
  contents.push({
    role: "user",
    parts: [{ text: systemPrompt }],
  });

  // Add prior turns for context
  for (const turn of history) {
    contents.push({
      role: turn.role === "user" ? "user" : "model",
      parts: [{ text: turn.text }],
    });
  }

  // Current user message
  contents.push({
    role: "user",
    parts: [{ text: userText }],
  });

  const body = { contents };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API error ${res.status}: ${t}`);
  }

  const data = await res.json();
  // Robust parsing across variants
  let reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
    data?.candidates?.[0]?.output ||
    "Sorry, I couldn’t process that. Please try again.";

  return reply.trim();
}

// ---------- Events ----------
async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  addBubble(text, "user");
  history.push({ role: "user", text });

  inputEl.value = "";
  setLoading(true);

  try {
    const reply = await callGemini(text);
    addBubble(reply, "bot");
    history.push({ role: "model", text: reply });
  } catch (err) {
    console.error(err);
    addBubble("Something went wrong. Please try again in a moment.", "bot");
    history.push({
      role: "model",
      text: "Something went wrong. Please try again in a moment.",
    });
  } finally {
    setLoading(false);
  }
}

// Enter to send, Shift+Enter for newline
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Start
seedGreeting();

function goBack() {
  window.location.href = "/"; // redirect to home
}
