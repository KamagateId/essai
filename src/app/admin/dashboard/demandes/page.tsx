"use client";
import React, { useState } from 'react';

const Demande: React.FC = () => {
  // États pour gérer les données du formulaire
  const [reference, setReference] = useState('');
  const [demandeur, setDemandeur] = useState('');
  const [montant, setMontant] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Logique de traitement des données (par exemple, envoi à une API)
    console.log('Référence:', reference);
    console.log('Demandeur:', demandeur);
    console.log('Montant:', montant);
    
    // Remettre à zéro les champs après soumission
    setReference('');
    setDemandeur('');
    setMontant('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6">Formulaire de Demande de Crédit</h2>
        
        {/* Champ Référence */}
        <div className="mb-4">
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
            Référence
          </label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Référence de la demande"
            required
          />
        </div>

        {/* Champ Demandeur */}
        <div className="mb-4">
          <label htmlFor="demandeur" className="block text-sm font-medium text-gray-700 mb-2">
            Demandeur (Nom de l'entreprise ou de la personne)
          </label>
          <input
            type="text"
            id="demandeur"
            value={demandeur}
            onChange={(e) => setDemandeur(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nom de l'entreprise ou de la personne"
            required
          />
        </div>

        {/* Champ Montant */}
        <div className="mb-4">
          <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2">
            Montant (F CFA)
          </label>
          <input
            type="number"
            id="montant"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Montant demandé"
            required
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Soumettre la Demande
        </button>
      </form>
    </div>
  );
};

export default Demande;