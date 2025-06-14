const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'undersky-secret',
  resave: false,
  saveUninitialized: true
}));

const users = {}; // username -> { password, photos: [] }

function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(401).send('Not logged in');
  }
  next();
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Missing fields');
  if (users[username]) return res.status(400).send('User exists');
  users[username] = { password, photos: [] };
  res.send('Registered');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }
  req.session.username = username;
  res.send('Logged in');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('Logged out');
  });
});

app.post('/upload', requireLogin, upload.single('photo'), (req, res) => {
  const user = users[req.session.username];
  const photo = {
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    uploadedAt: new Date(),
    location: req.body.location || '',
    permission: req.body.permission === 'true'
  };
  user.photos.push(photo);
  res.send('Uploaded');
});

app.get('/photos', (req, res) => {
  const result = [];
  for (const username in users) {
    const user = users[username];
    for (const p of user.photos) {
      result.push({ username, ...p });
    }
  }
  res.json(result);
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
