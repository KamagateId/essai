const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
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
const SECRET_KEY = 'azazzeaFZ23423azazZZEFSF';

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

// Route pour l'inscription d'un utilisateur
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO utilisateurs (Email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
      }
      res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

// Route pour la connexion et la génération du token
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
      const token = jwt.sign(user, SECRET_KEY);
      res.status(200).json({ message: 'Connexion réussie', token });
    } else {
      // Email ou mot de passe incorrect
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  });
});


// Créer une demande de crédit (protégée par JWT)
app.post('/credits', authenticateToken, (req, res) => {
  const { reference, demandeurs, montant, typeCredit, statut } = req.body; // Assurez-vous que 'demandeurs' est utilisé
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token

  const sql = 'INSERT INTO credits (user_id, reference, demandeurs, montant, type_de_credit, statut) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [user_id, reference, demandeurs, montant, typeCredit, statut], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la demande de crédit:', err); // Log de l'erreur
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

// Route pour modifier une demande de crédit (protégée par JWT)
app.put('/credits/:id', authenticateToken, (req, res) => {
  const { id } = req.params; // ID de la demande de crédit à modifier
  const { reference, demandeurs, montant, typeCredit, statut } = req.body; // Les champs à mettre à jour

  const sql = 'UPDATE credits SET reference = ?, demandeurs = ?, montant = ?, type_de_credit = ?, statut = ? WHERE id_credit = ? AND user_id = ?';
  db.query(sql, [reference, demandeurs, montant, typeCredit, statut, id, req.user.id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la demande de crédit:', err); // Log de l'erreur
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la demande de crédit' });
    }
    if (result.affectedRows === 0) {
      // Si aucune ligne n'est affectée, cela signifie que l'ID n'est pas trouvé
      return res.status(404).json({ message: 'Demande de crédit non trouvée' });
    }
    res.status(200).json({ message: 'Demande de crédit modifiée avec succès' });
  });
});

// Route pour supprimer une demande de crédit (protégée par JWT)
app.delete('/credits/:id', authenticateToken, (req, res) => {
  const { id } = req.params; // ID de la demande de crédit à supprimer

  const sql = 'DELETE FROM credits WHERE id_credit = ? AND user_id = ?';
  db.query(sql, [id, req.user.id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la demande de crédit:', err); // Log de l'erreur
      return res.status(500).json({ error: 'Erreur lors de la suppression de la demande de crédit' });
    }
    if (result.affectedRows === 0) {
      // Si aucune ligne n'est affectée, cela signifie que l'ID n'est pas trouvé
      return res.status(404).json({ message: 'Demande de crédit non trouvée' });
    }
    res.status(200).json({ message: 'Demande de crédit supprimée avec succès' });
  });
});


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
