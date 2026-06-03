(function(){'use strict';
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');
const isDesktop=window.matchMedia('(hover: hover) and (pointer: fine)').matches&&window.innerWidth>=1024;
const prm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Intro skip
(function introSkip(){const intro=document.querySelector('.intro');if(!intro)return;function skip(){intro.classList.add('dismissed');setTimeout(()=>intro.style.display='none',600)}const sb=document.getElementById('introSkip');if(sb)sb.addEventListener('click',skip);intro.addEventListener('click',e=>{if(e.target!==sb)skip()});setTimeout(()=>{if(intro&&intro.style.display!=='none')intro.style.display='none'},3000)})();

// Char split
const hl=document.getElementById('heroHeadline');
if(hl){let ci=0;hl.querySelectorAll('.line').forEach(line=>{const t=line.dataset.text||'';line.innerHTML='';[...t].forEach(ch=>{const s=document.createElement('span');s.className='char';s.style.setProperty('--i',ci++);s.textContent=ch===' '?'\u00A0':ch;line.appendChild(s)})})}

// Cursor
const cur=document.getElementById('cursor'),dot=document.getElementById('cursorDot');
if(isDesktop&&cur&&dot){let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`});
(function l(){cx+=(mx-cx)*.22;cy+=(my-cy)*.22;cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(l)})();
document.querySelectorAll('a,button,.service-row,.review,.brand,.contact-card,.product-card,.build-slide').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('is-hover'));el.addEventListener('mouseleave',()=>cur.classList.remove('is-hover'))})}else{[cur,dot].forEach(el=>{if(el)el.style.display='none'});document.documentElement.style.cursor='auto';document.body.style.cursor='auto';const s=document.createElement('style');s.textContent='body,a,button,*{cursor:auto!important}';document.head.appendChild(s)}

// Goo cursor
const sv=document.getElementById('gooCursor');
if(sv&&isDesktop){const balls=sv.querySelectorAll('.gb');let mx=innerWidth/2,my=innerHeight/2;const pos=[];balls.forEach(()=>pos.push({x:mx,y:my}));const lags=[0.45,0.28,0.18,0.12];
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
function loop(){pos.forEach((p,i)=>{p.x+=(mx-p.x)*lags[i];p.y+=(my-p.y)*lags[i];balls[i].setAttribute('cx',p.x);balls[i].setAttribute('cy',p.y)});sv.style.left='0';sv.style.top='0';sv.style.width=innerWidth+'px';sv.style.height=innerHeight+'px';sv.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);requestAnimationFrame(loop)}
sv.style.width=innerWidth+'px';sv.style.height=innerHeight+'px';sv.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);loop()}else if(sv){sv.style.display='none'}

// Magnetic
if(isDesktop&&!prm){document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.25}px,${y*.25}px)`});el.addEventListener('mouseleave',()=>{el.style.transform=''})})}

// Sticky nav + scroll progress
const nav=document.getElementById('topNav'),pg=document.getElementById('scrollProgress');
function sc(){const y=scrollY;if(nav){if(y>40)nav.classList.add('scrolled');else nav.classList.remove('scrolled')}if(pg){const m=(document.documentElement.scrollHeight-innerHeight)||1;pg.style.width=Math.min(100,(y/m)*100)+'%'}}
addEventListener('scroll',sc,{passive:true});sc();

// Reveal
const rv=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){const ro=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});rv.forEach(el=>ro.observe(el));setTimeout(()=>rv.forEach(el=>el.classList.add('in')),5000)}else{rv.forEach(el=>el.classList.add('in'))}

// Scramble numbers
function sn(el){if(el.dataset.scrambled)return;el.dataset.scrambled='1';const t=parseFloat(el.dataset.target);if(isNaN(t))return;const d=parseInt(el.dataset.decimal||'0',10),dur=1600,st=performance.now();const tk=now=>{const tt=Math.min((now-st)/dur,1);const e=1-Math.pow(1-tt,4);const cv=t*e;if(tt<.75){const sa=(1-e)*.5;const n=cv+(Math.random()-.5)*t*sa;el.textContent=d>0?n.toFixed(d):Math.round(n)}else{el.textContent=d>0?cv.toFixed(d):Math.round(cv)}if(tt<1)requestAnimationFrame(tk);else el.textContent=d>0?t.toFixed(d):t};el.textContent='0';requestAnimationFrame(tk)}
const scrs=document.querySelectorAll('.scramble');
if('IntersectionObserver' in window){const so2=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){sn(e.target);so2.unobserve(e.target)}})},{threshold:.4});scrs.forEach(el=>so2.observe(el))}

// Gauge ticks
const tg=document.getElementById('ticks');
if(tg){const gx=200,gy=200,r1=158,r2=175,fr=[];for(let i=0;i<=40;i++){const a=(-135+(i/40)*270)*Math.PI/180;const x1=gx+Math.cos(a)*r1,y1=gy+Math.sin(a)*r1;const x2=gx+Math.cos(a)*r2,y2=gy+Math.sin(a)*r2;const cls=i>=32?'red':(i%5===0?'major':'');fr.push(`<line class="gauge-tick ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);if(i%5===0){const tx=gx+Math.cos(a)*138,ty=gy+Math.sin(a)*138+4;fr.push(`<text class="gauge-num" x="${tx}" y="${ty}" text-anchor="middle">${(i/40)*8}</text>`)}}tg.innerHTML=fr.join('')}

// Gauge animate once on view
(function gauge(){const ga=document.getElementById('gauge'),nd=document.getElementById('gaugeNeedle'),ar=document.getElementById('gaugeArc'),ro2=document.getElementById('gaugeReadout');if(!ga||!nd)return;let done=false;function animate(){if(done)return;done=true;const start=performance.now(),dur=2200;function tick(now){const t=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-t,3);const p=ease;nd.style.transform=`rotate(${-135+p*230}deg)`;if(ar)ar.style.strokeDashoffset=String(1000-(1000-240)*p);if(ro2)ro2.textContent=Math.round(p*500);if(t<1)requestAnimationFrame(tick);else if(ro2)ro2.textContent='500'}requestAnimationFrame(tick)}if('IntersectionObserver' in window){const ob=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){animate();ob.unobserve(e.target)}})},{threshold:.35});ob.observe(ga)}else{animate()}})();

// Aurora shader
(function aurora(){const cv=document.getElementById('aurora');if(!cv)return;const gl=cv.getContext('webgl')||cv.getContext('experimental-webgl');if(!gl){cv.style.display='none';return}
const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`;
const fs=`precision highp float;uniform float u_t;uniform vec2 u_r;uniform vec2 u_m;
vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.0+2.0*fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);return mix(mix(dot(hash(i+vec2(0,0)),f-vec2(0,0)),dot(hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(hash(i+vec2(0,1)),f-vec2(0,1)),dot(hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<6;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/u_r;vec2 p=uv*3.5;p.x*=u_r.x/u_r.y;float t=u_t*0.08;
vec2 q=vec2(fbm(p+t),fbm(p-t*0.7+vec2(5.2,1.3)));vec2 r=vec2(fbm(p+q*1.8+vec2(1.7,9.2)+t*0.3),fbm(p+q*1.4+vec2(8.3,2.8)-t*0.4));float n=fbm(p+r*1.5);
vec2 mo=(u_m-0.5)*0.3;n+=fbm(p+mo*2.0+t*0.2)*0.2;
vec3 c1=vec3(0.018,0.025,0.045);vec3 c2=vec3(0.04,0.18,0.55);vec3 c3=vec3(0.18,0.49,1.0);vec3 c4=vec3(0.55,0.78,1.0);
vec3 col=mix(c1,c2,smoothstep(0.0,0.45,n));col=mix(col,c3,smoothstep(0.4,0.7,n));col=mix(col,c4,smoothstep(0.75,0.95,n)*0.6);
float streak=smoothstep(0.78,0.92,n);col+=streak*vec3(0.3,0.55,1.0)*0.8;
float vig=smoothstep(1.3,0.35,length(uv-vec2(0.5,0.55)));col*=mix(0.35,1.0,vig);
float g=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);col+=(g-0.5)*0.025;
gl_FragColor=vec4(col,1.0);}`;
function cs(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){return null}return s}
const v=cs(gl.VERTEX_SHADER,vs),f=cs(gl.FRAGMENT_SHADER,fs);if(!v||!f){cv.style.display='none';return}
const pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.style.display='none';return}
gl.useProgram(pr);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
const uT=gl.getUniformLocation(pr,'u_t'),uR=gl.getUniformLocation(pr,'u_r'),uM=gl.getUniformLocation(pr,'u_m');
let mx=0.5,my=0.5;addEventListener('mousemove',e=>{mx=e.clientX/innerWidth;my=1-e.clientY/innerHeight});
function size(){const dpr=Math.min(devicePixelRatio,1.5);const w=cv.clientWidth*dpr,h=cv.clientHeight*dpr;if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h)}}
size();addEventListener('resize',size);let lastY=scrollY,lastT=performance.now(),velMult=1,timeAcc=0;
function loop(){size();const now=performance.now();const dt=Math.max(1,now-lastT);const dy=scrollY-lastY;const vel=Math.abs(dy/dt);velMult=velMult*0.93+Math.min(7,1+vel*8)*0.07;timeAcc+=(dt/1000)*velMult;lastY=scrollY;lastT=now;gl.uniform1f(uT,timeAcc);gl.uniform2f(uR,cv.width,cv.height);gl.uniform2f(uM,mx,my);gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(loop)}loop()})();

// 3D Wheel
(function wheel(){const w3c=document.getElementById('wheel3d');if(!w3c||typeof THREE==='undefined'||prm)return;try{const sc=new THREE.Scene();const cm=new THREE.PerspectiveCamera(40,1,0.1,100);cm.position.z=6.5;const rn=new THREE.WebGLRenderer({canvas:w3c,alpha:true,antialias:true});rn.setPixelRatio(Math.min(devicePixelRatio,2));const wh=new THREE.Group();
wh.add(new THREE.Mesh(new THREE.TorusGeometry(2.1,0.28,32,80),new THREE.MeshStandardMaterial({color:0x2f7dff,metalness:.95,roughness:.15,emissive:0x0b3a8a,emissiveIntensity:.4})));
wh.add(new THREE.Mesh(new THREE.TorusGeometry(1.7,0.12,24,64),new THREE.MeshStandardMaterial({color:0xf4f4f6,metalness:.92,roughness:.18})));
wh.add(new THREE.Mesh(new THREE.TorusGeometry(1.9,0.06,20,64),new THREE.MeshStandardMaterial({color:0x5aa0ff,metalness:.95,roughness:.1,emissive:0x2f7dff,emissiveIntensity:.5})));
for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.18,0.1),new THREE.MeshStandardMaterial({color:0xe8e9ee,metalness:.88,roughness:.25}));s.rotation.z=(i*Math.PI*2)/5;wh.add(s);const sd=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.05,0.13),new THREE.MeshStandardMaterial({color:0x2f7dff,metalness:.9,roughness:.15,emissive:0x2f7dff,emissiveIntensity:.6}));sd.rotation.z=(i*Math.PI*2)/5;wh.add(sd)}
const rotor=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.06,48,1),new THREE.MeshStandardMaterial({color:0x4a4b54,metalness:.7,roughness:.5}));rotor.rotation.x=Math.PI/2;rotor.position.z=-0.18;wh.add(rotor);
for(let i=0;i<24;i++){const h=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.07,12),new THREE.MeshStandardMaterial({color:0x06070a}));const a=(i/24)*Math.PI*2;h.position.set(Math.cos(a)*1.1,Math.sin(a)*1.1,-0.18);h.rotation.x=Math.PI/2;wh.add(h)}
const cal=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.4,0.32),new THREE.MeshStandardMaterial({color:0x2f7dff,metalness:.85,roughness:.25,emissive:0x1058b3,emissiveIntensity:.4}));cal.position.set(0,1.35,-0.1);wh.add(cal);
const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.55,32),new THREE.MeshStandardMaterial({color:0x2f7dff,metalness:.95,roughness:.12,emissive:0x2f7dff,emissiveIntensity:.55}));hub.rotation.x=Math.PI/2;wh.add(hub);
const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.18,0.6,16),new THREE.MeshStandardMaterial({color:0xf4f4f6,metalness:.95,roughness:.1}));cap.rotation.x=Math.PI/2;wh.add(cap);
for(let i=0;i<5;i++){const lug=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.12,8),new THREE.MeshStandardMaterial({color:0xc5c6cc,metalness:.95,roughness:.2}));const a=(i*Math.PI*2)/5;lug.position.set(Math.cos(a)*0.55,Math.sin(a)*0.55,0.3);lug.rotation.x=Math.PI/2;wh.add(lug)}
sc.add(wh);sc.add(new THREE.AmbientLight(0xffffff,.3));const dl=new THREE.DirectionalLight(0xffffff,1.8);dl.position.set(5,6,6);sc.add(dl);const bl=new THREE.PointLight(0x2f7dff,3.5,18);bl.position.set(-5,3,4);sc.add(bl);const bl2=new THREE.PointLight(0xff3a45,1,10);bl2.position.set(4,-4,3);sc.add(bl2);const rim=new THREE.PointLight(0x5aa0ff,2,12);rim.position.set(0,0,-4);sc.add(rim);
wh.rotation.x=0.35;wh.rotation.y=0.25;
function rs(){const r=w3c.getBoundingClientRect();const w=r.width||300,h=r.height||300;cm.aspect=w/h;cm.updateProjectionMatrix();rn.setSize(w,h,false)}rs();addEventListener('resize',rs);
let wmx=0,wmy=0;addEventListener('mousemove',e=>{wmx=(e.clientX/innerWidth-.5)*.4;wmy=(e.clientY/innerHeight-.5)*.4});
function anim(){wh.rotation.z+=0.004;wh.rotation.x+=(0.35+wmy-wh.rotation.x)*0.05;wh.rotation.y+=(0.25+wmx-wh.rotation.y)*0.05;rn.render(sc,cm);requestAnimationFrame(anim)}anim()}catch(err){if(w3c)w3c.style.display='none'}})();

// Shop filter
(function shop(){const f=document.getElementById('shopFilters'),g=document.getElementById('shopGrid');if(!f||!g)return;const cards=g.querySelectorAll('.product-card');f.addEventListener('click',e=>{const btn=e.target.closest('.shop-filter');if(!btn)return;f.querySelectorAll('.shop-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;cards.forEach(c=>{const show=cat==='all'||c.dataset.cat===cat;c.classList.toggle('hide',!show)})})})();

// Idle pulse
(function idle(){let timer;function start(){clearTimeout(timer);document.documentElement.classList.remove('idle');timer=setTimeout(()=>document.documentElement.classList.add('idle'),6000)}['mousemove','scroll','keydown','touchstart','click'].forEach(ev=>addEventListener(ev,start,{passive:true}));start()})();


// Tab switching SPA
(function tabs(){
  const tabs=document.querySelectorAll('.tab-panel');
  const btns=document.querySelectorAll('[data-tab]');
  if(!tabs.length||!btns.length)return;
  function show(name){
    tabs.forEach(t=>t.classList.toggle('active',t.id==='tab-'+name));
    btns.forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
    window.scrollTo({top:0,behavior:'auto'});
    history.replaceState(null,'','#'+name);
    document.title=({home:'Powered By RPM — Subaru & High-Performance Builds | Huntington Beach',work:'The Work | Powered By RPM',shop:'Shop the Parts | Powered By RPM',visit:'Visit the Shop | Powered By RPM'})[name]||document.title;
    // Re-trigger any reveals in the now-visible tab
    setTimeout(()=>{document.querySelectorAll('.tab-panel.active .reveal').forEach(el=>el.classList.add('in'))},50);
    // Re-trigger any scrambles in newly visible tab
    setTimeout(()=>{document.querySelectorAll('.tab-panel.active .scramble').forEach(el=>{if(el.dataset.scrambled)return;sn(el)})},200);
  }
  btns.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();show(b.dataset.tab)}));
  // On load, check hash
  const init=(location.hash||'#home').slice(1);
  if(document.getElementById('tab-'+init))show(init);
})();

// Year
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();
