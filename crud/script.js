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

// Modal & Form
const modal     = document.getElementById('modal');
const form      = document.getElementById('form');
const nomeFld   = document.getElementById('nome');
const telFld    = document.getElementById('telefone');
const emailFld  = document.getElementById('email');
const empFld    = document.getElementById('empresa');
const setorFld  = document.getElementById('setor');
const saveBtn   = document.getElementById('btnSalvar');

let editingId = null;

const openModal = () => modal.classList.add('active');
const closeModal = () => {
  form.reset();
  editingId = null;
  modal.classList.remove('active');
};

const statusFld = document.getElementById('status');

// Preenche fields pra edição
function fillFields(client) {
  statusFld.value = client.status || 'pendente';
  nomeFld.value  = client.nome;
  telFld.value   = client.telefone;
  emailFld.value = client.email;
  empFld.value   = client.empresa;
  setorFld.value = client.setor;
  editingId      = client.id;
  openModal();
}

// CRUD Handlers
async function saveClient() {
  if (!form.reportValidity()) return;

  const payload = {
    status: statusFld.value,
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

// Monta linhas da tabela
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
    <td>${client.setor || ''}</td>
    <td class="acao"><button class="edit-btn"><i class='bx bx-edit'></i></button></td>
    <td class="acao"><button class="delete-btn"><i class='bx bx-trash'></i></button></td>
  `;
  const sel = tr.querySelector('.status-select');
  sel.value = client.status;
  // listener pra atualizar status sem modal:
  sel.addEventListener('change', async () => {
    try {
      await API.update(client.id, {
        nome: client.nome,
        telefone: client.telefone,
        email: client.email,
        empresa: client.empresa,
        setor: client.setor,
        status: sel.value
      });
      // opcional: feedback visual
    } catch (e) {
      console.error('Erro ao atualizar status', e);
      alert('Não rolou mudar status');
    }
  });
  
  // adiciona listeners em vez de inline onclick
  tr.querySelector('.edit-btn')
    .addEventListener('click', () => fillFields(client));
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

document.addEventListener('DOMContentLoaded', () => {
  // máscara de telefone
  const telefoneInput = document.getElementById('telefone');
  telefoneInput.addEventListener('input', (e) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length <= 10) {
      digits = digits.replace(
        /^(\d{0,2})(\d{0,4})(\d{0,4}).*/,
        (m, ddd, p1, p2) => `${ddd?`(${ddd}) `:''}${p1||''}${p2?`-${p2}`:''}`
      );
    } else {
      digits = digits.replace(
        /^(\d{0,2})(\d{0,5})(\d{0,4}).*/,
        (m, ddd, p1, p2) => `${ddd?`(${ddd}) `:''}${p1||''}${p2?`-${p2}`:''}`
      );
    }
    e.target.value = digits;
  });

  // CRUD listeners
  document.getElementById('btnCadastrarCliente')
    .addEventListener('click', openModal);
  document.getElementById('modalClose')
    .addEventListener('click', closeModal);
  document.getElementById('btnSalvar')
    .addEventListener('click', saveClient);

  // render inicial
  updateTable();
});

