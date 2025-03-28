require('dotenv').config({ path: 'C:/Users/User/Documents/GitHub/Usicode/.env' });
 // Carregar variáveis de ambiente
console.log('DB_USER:', process.env.DB_USER);
const express = require('express');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Conexão com MySQL segura
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint para receber solicitação
app.post('/solicitacao', (req, res) => {
  const { nome, telefone, email, empresa, setor } = req.body;

  if (!nome || !telefone || !email || !empresa || !setor) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  const query = 'INSERT INTO solicitacoes (nome, telefone, email, empresa, setor) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nome, telefone, email, empresa, setor], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).json({ mensagem: 'Erro ao salvar os dados.' });
    }

    enviarEmailNotificacao({ nome, telefone, email, empresa, setor });
    res.json({ mensagem: 'Solicitação enviada com sucesso!' });
  });
});

// Função para enviar email
function enviarEmailNotificacao(dados) {
  let transporter = nodemailer.createTransport({
    service: 'Locaweb',
    host: 'email-ssl.com.br',
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Nova Solicitação de Demonstração',
    text: `Nova solicitação recebida:
Nome: ${dados.nome}
Telefone: ${dados.telefone}
Email: ${dados.email}
Empresa: ${dados.empresa}
Setor: ${dados.setor}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Erro ao enviar email:', error);
    }
    console.log('Email enviado:', info.response);
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso!');
});