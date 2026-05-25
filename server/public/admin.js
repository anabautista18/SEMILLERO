async function $(sel){return document.querySelector(sel)}

const loginBox = await $("#loginBox");
const panel = await $("#panel");
const loginBtn = await $("#loginBtn");
const logoutBtn = await $("#logoutBtn");
const passwordInput = await $("#password");
const membersList = await $("#membersList");
const addMemberBtn = await $("#addMemberBtn");

async function api(path, opts={}){
  const res = await fetch(path, { credentials: 'include', headers:{'content-type':'application/json'}, ...opts });
  if (res.status === 401) throw new Error('unauthorized');
  return res.json();
}

async function checkAuth(){
  try{ const r = await api('/api/me'); return r.admin === true; }catch(e){return false}
}

async function renderMembers(){
  const items = await api('/api/members');
  membersList.innerHTML = '';
  items.forEach(m => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<div><strong>${m.name}</strong><div class="muted">${m.imageFront||''}</div></div><div><button data-id="${m.id}" class="del">Eliminar</button></div>`;
    membersList.appendChild(div);
  });
  membersList.querySelectorAll('.del').forEach(b=>b.addEventListener('click', async (ev)=>{ const id = ev.target.dataset.id; await api('/api/members/'+id, { method:'DELETE' }); renderMembers(); }));
}

async function showPanel(){ loginBox.style.display='none'; panel.style.display='block'; await renderMembers(); }
async function showLogin(){ loginBox.style.display='block'; panel.style.display='none'; }

loginBtn.addEventListener('click', async ()=>{
  try{
    await api('/api/login', { method: 'POST', body: JSON.stringify({ password: passwordInput.value }) });
    await showPanel();
  }catch(e){ alert('Contraseña incorrecta'); }
});

logoutBtn.addEventListener('click', async ()=>{ await api('/api/logout', { method: 'POST' }); showLogin(); });

addMemberBtn.addEventListener('click', async ()=>{
  const name = document.getElementById('m_name').value;
  const front = document.getElementById('m_front').value;
  const back = document.getElementById('m_back').value;
  if(!name) return alert('Nombre requerido');
  await api('/api/members', { method: 'POST', body: JSON.stringify({ name, imageFront: front, imageBack: back }) });
  document.getElementById('m_name').value=''; document.getElementById('m_front').value=''; document.getElementById('m_back').value='';
  renderMembers();
});

(async function init(){ if (await checkAuth()) { showPanel(); } else { showLogin(); } })();
