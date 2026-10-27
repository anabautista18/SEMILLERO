async function $(sel){return document.querySelector(sel)}

const loginBox = await $("#loginBox");
const panel = await $("#panel");
const loginBtn = await $("#loginBtn");
const logoutBtn = await $("#logoutBtn");
const passwordInput = await $("#password");
const membersList = await $("#membersList");
const addMemberBtn = await $("#addMemberBtn");
const cancelMemberBtn = await $("#cancelMemberBtn");
const memberFormTitle = await $("#memberFormTitle");
let editingId = null;

async function api(path, opts={}){
  const res = await fetch(path, { credentials: 'include', headers:{'content-type':'application/json'}, ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'No se pudo completar la solicitud');
  return data;
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
    const details = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = m.name;
    details.appendChild(name);
    const links = document.createElement('div');
    links.className = 'muted';
    links.textContent = [m.linkedin && 'LinkedIn', m.github && 'GitHub'].filter(Boolean).join(' · ') || (m.imageFront || 'Sin foto');
    details.appendChild(links);
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    edit.textContent = 'Editar';
    edit.addEventListener('click', () => startEdit(m));
    const remove = document.createElement('button');
    remove.textContent = 'Eliminar';
    remove.addEventListener('click', async () => {
      try {
        await api('/api/members/' + m.id, { method:'DELETE' });
        await renderMembers();
      } catch (error) {
        alert(error.message);
      }
    });
    actions.append(edit, remove);
    div.append(details, actions);
    membersList.appendChild(div);
  });
}

function clearMemberForm(){
  editingId = null;
  ['m_name', 'm_front', 'm_back', 'm_linkedin', 'm_github'].forEach(id => {
    document.getElementById(id).value = '';
  });
  addMemberBtn.textContent = 'Agregar';
  cancelMemberBtn.style.display = 'none';
  memberFormTitle.textContent = 'Agregar integrante';
}

function startEdit(member){
  editingId = member.id;
  document.getElementById('m_name').value = member.name || '';
  document.getElementById('m_front').value = member.imageFront || '';
  document.getElementById('m_back').value = member.imageBack || '';
  document.getElementById('m_linkedin').value = member.linkedin || '';
  document.getElementById('m_github').value = member.github || '';
  addMemberBtn.textContent = 'Guardar cambios';
  cancelMemberBtn.style.display = 'block';
  memberFormTitle.textContent = 'Editar integrante';
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
  const linkedin = document.getElementById('m_linkedin').value;
  const github = document.getElementById('m_github').value;
  if(!name) return alert('Nombre requerido');
  try {
    const member = { name, imageFront: front, imageBack: back, linkedin, github };
    if (editingId) {
      await api('/api/members/' + editingId, { method: 'PUT', body: JSON.stringify(member) });
    } else {
      await api('/api/members', { method: 'POST', body: JSON.stringify(member) });
    }
    clearMemberForm();
    await renderMembers();
  } catch (error) {
    alert(error.message);
  }
});

cancelMemberBtn.addEventListener('click', clearMemberForm);

(async function init(){ if (await checkAuth()) { showPanel(); } else { showLogin(); } })();
