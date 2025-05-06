// A partir da 


const openModal = () => document.getElementById('modal')
  .classList.add('active')

const closeModal = () => { 
  clearFields() 
  document.getElementById('modal').classList.remove('active')
  
}


const updateClient = (index, client) => {
  const dbClient = readClient()
  dbClient[index] = client
  setLocalStorage(dbClient)
}

function readClient() {
  return getLocalStorage();
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('dbclient')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("dbclient", JSON.stringify(dbClient))

const createClient = (client) => {
  const dbclient = getLocalStorage()
  dbclient.push(client)
  setLocalStorage(dbclient)
}

const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

const clearFields = () => document.getElementById('form').reset()


const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById('nome').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('email').value,
      empresa: document.getElementById('empresa').value,
      setor: document.getElementById('setor').value,
    }
    const index = document.getElementById('nome').dataset.index
    if (index == 'new') {
      createClient(client)
      updateTable()
      closeModal()
    } else {
      updateClient(index, client)
      updateTable()
      closeModal()
    }
    
  }

}

const fillFields = (client) => {
  document.getElementById('nome').value = client.nome
  document.getElementById('telefone').value = client.telefone
  document.getElementById('email').value = client.email
  document.getElementById('empresa').value = client.empresa
  document.getElementById('setor').value = client.setor
  document.getElementById('nome').dataset.index = client.index
}

function editClient(index) {
  openModal(true, index)
 const client = readClient()[index]
 client.index = index
 fillFields(client)
  
}

function deleteClient(index) {
  const client = readClient()[index]
  const response = confirm(`Deseja realmente excluir o cliente ${client.nome} ?`)
  if (response) {

  }
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
  updateTable();
}



const createRow = (client, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
    <td>${client.nome}</td>
     <td>${client.telefone}</td>
    <td>${client.email}</td> 
    <td>${client.empresa}</td>
    <td>${client.setor}</td> 
    <td class="acao">
      <button onclick="editClient(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteClient(${index})"><i class='bx bx-trash'></i></button>
    </td>
     `
  document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  rows.forEach((row) => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbClient = readClient()
  clearTable()
  dbClient.forEach((client, index) => createRow(client, index))
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