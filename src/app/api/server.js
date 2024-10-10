const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Pour gérer les tokens JWT
const app = express();
const port = 3001;

// Middleware pour permettre les requêtes CORS et parser les requêtes JSON
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'essai_bhci2'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données MySQL:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL!');
});

// Clé secrète pour signer les tokens JWT
const SECRET_KEY = 'votre_clé_secrète';

// Middleware pour vérifier les tokens JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Accès refusé' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user; // Attache l'utilisateur décodé à la requête
    next();
  });
};

// Route pour la connexion et la génération du token
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM utilisateurs WHERE Email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la requête' });
    }

    if (results.length > 0) {
      const user = { id: results[0].id, email: results[0].Email };
      const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Connexion réussie', token });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  });
});

// Créer une demande de crédit (protégée par JWT)
app.post('/credits', authenticateToken, (req, res) => {
  const { reference, date, demandeurs, montant, type_de_credit, statut } = req.body;
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token

  const sql = 'INSERT INTO credits (user_id, reference, date, demandeurs, montant, type_de_credit, statut) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [user_id, reference, date, demandeurs, montant, type_de_credit, statut], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de l\'ajout de la demande de crédit' });
    }
    res.status(201).json({ message: 'Demande de crédit créée avec succès', id_credit: result.insertId });
  });
});

// Lire toutes les demandes de crédits (protégée par JWT)
app.get('/credits', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM credits WHERE user_id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des demandes de crédits' });
    }
    res.status(200).json(results);
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
