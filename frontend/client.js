"use strict";
(function(){
  const SERVER_BASE = "/api"; // serverless endpoints relative path on Vercel
  const messagesEl = document.getElementById("messages");
  const form = document.getElementById("f");
  const input = document.getElementById("m");
  let me = {email:null,name:'Guest',role:'user'};
  // load history
  async function loadHistory(){
    const r = await fetch(SERVER_BASE + "/messages");
    const data = await r.json();
    messagesEl.innerHTML = "";
    data.forEach(addMessage);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function addMessage(m){
    const div = document.createElement("div");
    div.className = "msg";
    if(m.role === 'owner') div.className += ' owner';
    div.id = 'msg-'+m.id;
    div.innerHTML = '<b>'+escapeHtml(m.name)+'</b> ('+(m.email||'guest')+'): '+escapeHtml(m.text)+' <small>'+new Date(m.ts).toLocaleString()+'</small>';
    messagesEl.appendChild(div);
  }
  function escapeHtml(s){return (s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
  form?.addEventListener('submit', async (e)=>{ e.preventDefault(); if(!input.value.trim()) return;
    await fetch(SERVER_BASE + '/send', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:me.email,name:me.name,role:me.role,text:input.value})});
    input.value=''; await loadHistory();
  });
  document.getElementById('set')?.addEventListener('click',(e)=>{ e.preventDefault(); me.email = document.getElementById('email').value || null; me.name = document.getElementById('name').value || 'Guest'; me.role = document.getElementById('role').value || 'user'; alert('Set as '+me.email+' ('+me.role+')'); });
  // admin execute
  document.getElementById('do')?.addEventListener('click', async ()=>{
    const action = document.getElementById('action').value;
    const target = document.getElementById('target').value;
    const payload = {action, target, email: me.email, role: me.role};
    const r = await fetch(SERVER_BASE + '/admin', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const j = await r.json(); document.getElementById('log').innerText = JSON.stringify(j);
    await loadHistory();
  });
  // birthday modal
  document.getElementById('birthdayMenu')?.addEventListener('click',(e)=>{ e.preventDefault(); document.getElementById('birthdayModal').style.display='block'; try{ document.getElementById('b1').play().catch(()=>{}); document.getElementById('b2').play().catch(()=>{});}catch(e){} });
  document.getElementById('closeModal')?.addEventListener('click',()=> document.getElementById('birthdayModal').style.display='none');
  document.getElementById('playSoundBtn')?.addEventListener('click', ()=>{ document.getElementById('b1').play().catch(()=>{}); document.getElementById('b2').play().catch(()=>{}); });
  // polling loop
  setInterval(loadHistory, 1500);
  loadHistory();
})();
