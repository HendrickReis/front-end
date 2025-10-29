const express = require('express');
const handlebars = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const http = require('http');
const ws = require('ws');
const multer = require('multer')

const app = express();
const dirname = path.resolve();
const server = http.createServer(app);
const wss = new ws.Server({ server });

let mensagens = [], usuarios = []

app.engine('hbs', handlebars.engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', 'hbs');
app.set('views', path.join(dirname, 'views'));

app.use(cors({ origin: /localhost:\d+/ }));
app.get(/\.css$/, (req, res, next) => {
  res.type('text/css');
  next();
});
app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/imagens/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

app.get('/', (req, res) => {
  const nome = req.query.nome;
  const imagem = req.query.imagem;
  res.render('teste', { titulo: 'Sala Geral', mensagens });
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { titulo: 'Cadastre-se no chat!' })
})

app.post('/dados', upload.single('imagem'), (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const { nome } = req.body;
  const imagem = req.file ? req.file.filename : null;

  res.json({ nome, imagem });
});

wss.on('connection', (socket) => {
  console.log('🟢 Novo cliente conectado');

  socket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg)

      mensagens.push(data)

      console.log('📨 Mensagem recebida:', JSON.stringify(data.conteudo));

      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }

    catch (err) {
      console.error('❌ Erro ao processar mensagem:', err);
    }
  });

  socket.on('close', () => console.log('🔴 Cliente desconectou'));
});

server.listen(8080, () => console.log('🚀 Servidor rodando em http://localhost:8080'));
