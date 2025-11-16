// Simulated live alerts feed for prototype
(function(){
  const start = document.getElementById('startFeed');
  const stop = document.getElementById('stopFeed');
  const container = document.getElementById('alertsContainer');
  let timer = null;
  const types = [
    {k:'Road block', color:'alert-danger'},
    {k:'Construction', color:''},
    {k:'Traffic jam', color:''},
    {k:'Accident', color:'alert-danger'},
    {k:'Crowd / Protest', color:'alert-danger'}
  ];

  function pushAlert(){
    const item = types[Math.floor(Math.random()*types.length)];
    const now = new Date();
    const el = document.createElement('div'); el.className='alert-item';
    const left = document.createElement('div');
    const title = document.createElement('div'); title.className='alert-type '+(item.color||''); title.textContent = item.k;
    const meta = document.createElement('div'); meta.className='alert-meta'; meta.textContent = `Reported ${now.toLocaleTimeString()} — near Ferozepur Road`;
    left.appendChild(title); left.appendChild(meta);
    const right = document.createElement('div'); right.innerHTML = '<small>Auto report</small>';
    el.appendChild(left); el.appendChild(right);
    container.insertBefore(el, container.firstChild);
    // keep list to last 20
    while(container.children.length>20) container.removeChild(container.lastChild);
  }

  start.addEventListener('click', ()=>{
    if(timer) return; pushAlert(); timer = setInterval(pushAlert, 2200);
    start.disabled = true; stop.disabled = false;
  });
  stop.addEventListener('click', ()=>{
    if(timer) clearInterval(timer); timer = null; start.disabled = false; stop.disabled = true;
  });
  // init
  stop.disabled = true;
})();
