// Lightweight client-side companion for LahoreGPT
(function(){
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');
  const apiKeyEl = document.getElementById('apiKey');
  const useOpenAIEl = document.getElementById('useOpenAI');
  const autoSpeakEl = document.getElementById('autoSpeak');

  let recognition = null;
  let listening = false;

  // Simple utilities
  function el(tag, cls, text){ const e = document.createElement(tag); if(cls) e.className = cls; if(text!=null) e.textContent = text; return e }
  function addMessage(text, from='assistant'){
    const wrapper = el('div', 'msg ' + (from==='user'?'user':''));
    const bubble = el('div', 'bubble', text);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if(from!=='user' && autoSpeakEl.checked){ speak(text) }
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  // Basic rule-based fallback responder for offline/demo use
  function localResponder(prompt){
    const p = prompt.toLowerCase();
    if(p.includes('history')||p.includes('historic')||p.includes('mughal')){
      return "Lahore has a rich history — the Shahi Qila (Lahore Fort) and Badshahi Mosque are 17th-century Mughal landmarks. The city was a cultural hub under the Mughals and later the Sikh Empire.";
    }
    if(p.includes('plan')||p.includes('itinerary')){
      return "Sample 1-day Lahore itinerary: Morning at Badshahi Mosque & Lahore Fort, lunch at Food Street, afternoon at Lahore Museum and Shalimar Gardens, evening stroll in Anarkali Bazaar.";
    }
    if(p.includes('food')||p.includes('eat')||p.includes('where to eat')){
      return "Try local favorites: nihari, haleem, and the famous Lahori chargha. For street food, head to Gawalmandi or Fort Road Food Street.";
    }
    // short friendly fallback
    return "I'm LahoreGPT — I can give history, plan trips, or guide you by voice. Try: 'Tell me about Lahore's history', or 'Plan a one-day trip'.";
  }

  async function callOpenAI(prompt){
    const key = apiKeyEl.value.trim();
    if(!key){ throw new Error('API key required for OpenAI mode') }
    // light client-side request — note: may be blocked by CORS. Prefer server proxy in production.
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{role:'system', content:'You are LahoreGPT, a friendly local tour guide for Lahore, Pakistan.'},{role:'user', content:prompt}],
      max_tokens:400
    };
    const res = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify(body)
    });
    if(!res.ok){ const txt = await res.text(); throw new Error('OpenAI error: '+res.status+' '+txt) }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? 'No response';
  }

  async function handleSend(){
    const text = inputEl.value.trim(); if(!text) return;
    addMessage(text,'user'); inputEl.value='';
    try{
      if(useOpenAIEl.checked){
        addMessage('Thinking...','assistant');
        const reply = await callOpenAI(text);
        // remove 'Thinking...' and append real reply
        const last = messagesEl.querySelector('.msg:not(.user):last-child');
        if(last) last.remove();
        addMessage(reply,'assistant');
      } else {
        const reply = localResponder(text);
        addMessage(reply,'assistant');
      }
    }catch(err){
      // show fallback helpful error and fallback to local responder
      const msg = 'Error using OpenAI: '+err.message + '\nFalling back to local responses.';
      addMessage(msg,'assistant');
      addMessage(localResponder(text),'assistant');
    }
  }

  // Speech recognition toggle
  function initSpeech(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) { micBtn.style.display='none'; return }
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript;
      inputEl.value = t; handleSend();
    };
    recognition.onend = () => { listening = false; micBtn.textContent='🎤' }
  }

  micBtn.addEventListener('click', ()=>{
    if(!recognition) initSpeech();
    if(!recognition) return;
    if(listening){ recognition.stop(); listening=false; micBtn.textContent='🎤' }
    else { recognition.start(); listening=true; micBtn.textContent='⏹️' }
  });

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ handleSend(); } });

  // Welcome message
  addMessage('Assalamualaikum! I am LahoreGPT — ask me about Lahore, request a trip plan, or say "history" to learn about landmarks. Toggle OpenAI in Settings to connect a key.', 'assistant');

  // initialize speech recognition in background (optional)
  try{ initSpeech(); }catch(e){ /* ignore */ }
})();
