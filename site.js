(function(){
  var root=document.documentElement, reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* mobile menu */
  var burger=document.getElementById('burger'), links=document.getElementById('links');
  if(burger&&links){
    burger.addEventListener('click',function(){var o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false');});
    links.addEventListener('click',function(e){if(e.target.tagName==='A'){links.classList.remove('open');burger.setAttribute('aria-expanded','false');}});
  }

  /* scroll reveal: anything already on screen shows immediately; everything shows after 9s as a safety net */
  var els=[].slice.call(document.querySelectorAll('.rv,.rt'));
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
    els.forEach(function(el){var r=el.getBoundingClientRect(); if(r.top<innerHeight*.85){el.classList.add('in');}else{io.observe(el);}});
    setTimeout(function(){els.forEach(function(el){el.classList.add('in');});},9000);
  }else{els.forEach(function(el){el.classList.add('in');});}

  /* hero phone cycles through screens */
  var wrap=document.getElementById('slides');
  if(wrap){
    var slides=[].slice.call(wrap.querySelectorAll('.slide')), dots=document.getElementById('dots'), pill=document.getElementById('pill'), cur=0, timer=null, hold=false;
    slides.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show '+s.dataset.label);b.addEventListener('click',function(){go(i);restart();});dots.appendChild(b);});
    var go=function(n){
      var prev=slides[cur]; prev.classList.remove('on'); prev.classList.add('off');
      setTimeout(function(){prev.classList.remove('off');},700);
      cur=n; slides[cur].classList.add('on');
      [].forEach.call(dots.children,function(d,i){d.classList.toggle('on',i===cur);});
      pill.textContent=slides[cur].dataset.label; pill.classList.remove('pop'); void pill.offsetWidth; if(!reduce)pill.classList.add('pop');
    };
    var restart=function(){clearInterval(timer); if(!reduce){timer=setInterval(function(){if(!hold&&!document.hidden)go((cur+1)%slides.length);},3400);}};
    var stage=document.querySelector('.hero-stage'); stage.addEventListener('mouseenter',function(){hold=true;}); stage.addEventListener('mouseleave',function(){hold=false;});
    go(0); restart();
  }

  /* cursor tilt, mouse and trackpad only */
  if(!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    [].forEach.call(document.querySelectorAll('.tilt'),function(p){
      var area=p.closest('.stage,.hero-stage,.screen-card')||p;
      area.addEventListener('pointermove',function(e){
        var r=p.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        x=Math.max(-1,Math.min(1,x*1.4)); y=Math.max(-1,Math.min(1,y*1.4));
        p.style.setProperty('--ry',(x*16).toFixed(1)+'deg'); p.style.setProperty('--rx',(-y*12).toFixed(1)+'deg');
        p.style.setProperty('--gx',((x+.5)*100).toFixed(0)+'%'); p.style.setProperty('--gy',((y+.5)*100).toFixed(0)+'%'); p.classList.add('hot');
      });
      area.addEventListener('pointerleave',function(){p.style.setProperty('--ry','0deg');p.style.setProperty('--rx','0deg');p.classList.remove('hot');});
    });
  }
})();
