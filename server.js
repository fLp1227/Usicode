const express = require('express');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

// Middleware para interpretar JSON
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Conexão com o MySQL (ajuste os parâmetros conforme sua configuração)
const db = mysql.createConnection({
  host: 'localhost3306',
  user: 'root',
  password: 'P!nkCerebro5693%',
  database: 'prosp_db'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Endpoint para receber os dados da solicitação
app.post('/solicitacao', (req, res) => {
  const { nome, telefone, email, empresa, setor } = req.body;

  // Validação simples
  if (!nome || !telefone || !email || !empresa || !setor) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  // Insere os dados na tabela 'solicitacoes'
  const query = 'INSERT INTO solicitacoes (nome, telefone, email, empresa, setor) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nome, telefone, email, empresa, setor], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).json({ mensagem: 'Erro ao salvar os dados.' });
    }

    // Após salvar, envia a notificação por email
    enviarEmailNotificacao({ nome, telefone, email, empresa, setor });
    res.json({ mensagem: 'Solicitação enviada com sucesso!' });
  });
});

// Função para enviar email de notificação
function enviarEmailNotificacao(dados) {
  // Configure o transporte de email (exemplo com Gmail)
  let transporter = nodemailer.createTransport({
    service: 'usicode',
    auth: {
      user: 'lucas@usicode.com.br',
      pass: 'master' // Use variáveis de ambiente em produção!
    }
  });

  let mailOptions = {
    from: 'lucas@usicode.com.br',
    to: 'lucas@usicode.com.br', // Altere para seu email de destino
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
