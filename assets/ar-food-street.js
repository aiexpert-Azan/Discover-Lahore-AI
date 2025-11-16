// Simple demo behavior for AR Food Street prototype
(function(){
  const scanBtn = document.getElementById('scanBtn');
  const preview = document.getElementById('arPreview');

  const sample = {
    stall: 'Gawalmandi Sweets & Eats',
    dishes: [
      {name:'Nihari', img:'https://via.placeholder.com/160x120?text=Nihari', rating:4.6, price:'PKR 450'},
      {name:'Chargha', img:'https://via.placeholder.com/160x120?text=Chargha', rating:4.3, price:'PKR 700'},
      {name:'Gol Gappa', img:'https://via.placeholder.com/160x120?text=Gol+Gappa', rating:4.0, price:'PKR 150'},
    ],
    hygiene: 'B+',
    reviews: [
      'Excellent flavors and quick service.',
      'Loved the nihari, but keep an eye on portion sizes.',
    ]
  };

  function renderAR(stall){
    preview.innerHTML = '';
    const overlay = document.createElement('div'); overlay.className='overlay';
    const title = document.createElement('h3'); title.textContent = stall.stall; overlay.appendChild(title);
    const hygiene = document.createElement('div'); hygiene.className='small'; hygiene.textContent = 'Hygiene rating: ' + stall.hygiene; overlay.appendChild(hygiene);
    stall.dishes.forEach(d => {
      const card = document.createElement('div'); card.className='dish-card';
      const img = document.createElement('img'); img.src = d.img; img.className='dish-img';
      const meta = document.createElement('div'); meta.className='dish-meta';
      const name = document.createElement('div'); name.textContent = d.name + ' — ' + d.price;
      const rating = document.createElement('div'); rating.className='rating'; rating.textContent = 'Rating: ' + d.rating;
      const reviews = document.createElement('div'); reviews.className='reviews'; reviews.textContent = 'Top review: ' + (stall.reviews[0]||'—');
      meta.appendChild(name); meta.appendChild(rating); meta.appendChild(reviews);
      card.appendChild(img); card.appendChild(meta);
      overlay.appendChild(card);
    });
    preview.appendChild(overlay);
  }

  scanBtn.addEventListener('click', ()=>{
    scanBtn.disabled = true; scanBtn.textContent = 'Scanning...';
    setTimeout(()=>{
      renderAR(sample);
      scanBtn.disabled = false; scanBtn.textContent = 'Scan Stall';
    }, 900);
  });
})();
