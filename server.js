// server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express    = require('express');
const cors       = require('cors');
const mysql      = require('mysql2');
const nodemailer = require('nodemailer');

const app  = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'crud'))); // serve seu front

// Pool de conexão MySQL
const db = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

// Rotas CRUD
app.get('/solicitacao', (req, res) => {
  db.query('SELECT * FROM solicitacoes ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(rows);
  });
});

// POST /solicitacao
app.post('/solicitacao', (req, res) => {
  const {
    nome,
    telefone,
    email,
    empresa,
    setor,
    sendEmail = false
  } = req.body;
  const status = req.body.status || 'pendente';

  // validação mínima
  if (!nome || !telefone || !email) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios faltando.' });
  }

  // insere no banco incluindo status
  const sql = `
    INSERT INTO solicitacoes
      (nome, telefone, email, empresa, setor, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql,
    [nome, telefone, email, empresa || null, setor || null, status],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir no DB:', err);
        return res.status(500).json({ erro: 'Erro interno ao salvar.' });
      }

      // dispara e-mail só se precisar
      if (sendEmail) {
        try {
          enviarEmailNotificacao({ nome, telefone, email, empresa, setor });
        } catch (mailErr) {
          console.error('Erro no envio de notificação:', mailErr);
          // não aborta a resposta
        }
      }

      // retorna sucesso com novo ID
      res.json({
        mensagem: 'Criado!',
        id: result.insertId
      });
    }
  );
});


app.put('/solicitacao/:id', (req, res) => {
  const { id } = req.params;
  const {
    nome,
    telefone,
    email,
    empresa,
    setor,
    status = 'pendente'
  } = req.body;

  // validação mínima (opcional)
  if (!nome || !telefone || !email) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios faltando.' });
  }

  // atualiza todos os campos incluindo status
  const sql = `
    UPDATE solicitacoes
      SET nome=?, telefone=?, email=?, empresa=?, setor=?, status=?
    WHERE id=?
  `;
  db.query(sql,
    [nome, telefone, email, empresa || null, setor || null, status, id],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar no DB:', err);
        return res.status(500).json({ erro: 'Erro interno ao atualizar.' });
      }
      res.json({ mensagem: 'Atualizado!' });
    }
  );
});

app.delete('/solicitacao/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM solicitacoes WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Deletado!' });
  });
});

// Healthcheck
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Função de e-mail
function enviarEmailNotificacao(dados) {
  const transporter = nodemailer.createTransport({
    service: 'Locaweb',
    host:    'email-ssl.com.br',
    port:    465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from:    process.env.EMAIL_USER,
    to:      process.env.EMAIL_TO,
    subject: '📢 Nova Solicitação',
    text:    `Nome: ${dados.nome}\nTel: ${dados.telefone}\nEmail: ${dados.email}\nEmpresa: ${dados.empresa}\nSetor: ${dados.setor}`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('Erro email:', err);
    else    console.log('Email enviado:', info.response);
  });
}

app.listen(port, '0.0.0.0', () => console.log(`🚀 Server na porta ${port}`));
