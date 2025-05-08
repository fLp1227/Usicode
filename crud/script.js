// script.js

// Helpers API
const API = {
  base: '/solicitacao',
  async list() {
    const res = await fetch(this.base);
    if (!res.ok) throw new Error('Erro ao listar');
    return res.json();
  },
  async create(payload) {
    const res = await fetch(this.base, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro ao criar');
    return res.json();
  },
  async update(id, payload) {
    const res = await fetch(`${this.base}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro ao atualizar');
  },
  async remove(id) {
    const res = await fetch(`${this.base}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar');
  }
};

// DOM References
const modal    = document.getElementById('modal');
const form     = document.getElementById('form');
const statusFld= document.getElementById('status');
const nomeFld  = document.getElementById('nome');
const telFld   = document.getElementById('telefone');
const emailFld = document.getElementById('email');
const empFld   = document.getElementById('empresa');
const setorFld = document.getElementById('setor');
const saveBtn  = document.getElementById('btnSalvar');

let editingId = null;

// Modal open/close
const openModal  = () => modal.classList.add('active');
const closeModal = () => {
  form.reset();
  editingId = null;
  statusFld.classList.remove('pendente','atendido','resolvido');
  modal.classList.remove('active');
};

// Preenche fields pra edição
function fillFields(client) {
  // seta valor e classe do status
  statusFld.value = client.status || 'pendente';
  statusFld.classList.remove('pendente','atendido','resolvido');
  statusFld.classList.add(client.status || 'pendente');

  nomeFld.value   = client.nome;
  telFld.value    = client.telefone;
  emailFld.value  = client.email;
  empFld.value    = client.empresa;
  setorFld.value  = client.setor;
  editingId       = client.id;
  openModal();
}

// Salvar ou atualizar via modal
async function saveClient() {
  if (!form.reportValidity()) return;

  const payload = {
    status:   statusFld.value,
    nome:     nomeFld.value,
    telefone: telFld.value,
    email:    emailFld.value,
    empresa:  empFld.value,
    setor:    setorFld.value
  };

  try {
    if (editingId) {
      await API.update(editingId, payload);
    } else {
      await API.create(payload);
    }
    await updateTable();
    closeModal();
  } catch (err) {
    console.error(err);
    alert('Ocorreu um erro. Checa o console.');
  }
}

// Deletar cliente
async function deleteClient(id) {
  if (!confirm('Quer mesmo excluir?')) return;
  try {
    await API.remove(id);
    await updateTable();
  } catch (err) {
    console.error(err);
    alert('Erro ao deletar');
  }
}

// Monta linhas da tabela com status inline
function createRow(client) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <select class="status-select">
        <option value="pendente">Pendente</option>
        <option value="atendido">Atendido</option>
        <option value="resolvido">Resolvido</option>
      </select>
    </td>
    <td>${client.nome}</td>
    <td>${client.telefone}</td>
    <td>${client.email}</td>
    <td>${client.empresa || ''}</td>
    <td>${client.setor   || ''}</td>
    <td class="acao"><button class="edit-btn"><i class='bx bx-edit'></i></button></td>
    <td class="acao"><button class="delete-btn"><i class='bx bx-trash'></i></button></td>
  `;

  const sel = tr.querySelector('.status-select');
  // valor e classe iniciais
  sel.value = client.status;
  sel.classList.add(client.status);

  // update inline de status
  sel.addEventListener('change', async () => {
    const old = client.status;
    const neu = sel.value;
    const payload = { ...client, status: neu };

    try {
      await API.update(client.id, payload);
      // atualiza local e UI sem reload
      client.status = neu;
      sel.classList.remove(old);
      sel.classList.add(neu);
    } catch (e) {
      console.error('Erro ao atualizar status', e);
      alert('Não rolou mudar status');
      sel.value = old; // volta no erro
    }
  });

  // editar/excluir
  tr.querySelector('.edit-btn')
    .addEventListener('click',  () => fillFields(client));
  tr.querySelector('.delete-btn')
    .addEventListener('click', () => deleteClient(client.id));

  document.querySelector('#tableClient>tbody').appendChild(tr);
}

// Atualiza toda a tabela
async function updateTable() {
  document.querySelectorAll('#tableClient>tbody tr')
    .forEach(tr => tr.remove());

  const clients = await API.list();
  clients.forEach(createRow);
}

// Setup listeners e máscara
document.addEventListener('DOMContentLoaded', () => {
  // máscara de telefone
  telFld.addEventListener('input', e => {
    let d = e.target.value.replace(/\D/g, '');
    if (d.length > 11) d = d.slice(0, 11);
    e.target.value = d.length <= 10
      ? d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (m, a,b,c) => `${a?`(${a}) `:''}${b||''}${c?`-${c}`:''}`)
      : d.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (m, a,b,c) => `${a?`(${a}) `:''}${b||''}${c?`-${c}`:''}`);
  });

  // CRUD listeners
  document.getElementById('btnCadastrarCliente')
    .addEventListener('click', openModal);
  document.getElementById('modalClose')
    .addEventListener('click', closeModal);
  saveBtn.addEventListener('click', saveClient);

  // render inicial
  updateTable();
});
