"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Demande: React.FC = () => {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [demandeur, setDemandeur] = useState('');
  const [montant, setMontant] = useState('');
  const [typeCredit, setTypeCredit] = useState('');
  const [statut, setStatut] = useState('');
  
  // Obtenir le token de l'utilisateur stocké (par exemple, dans localStorage)
  const token = localStorage.getItem('token');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requestBody = {
      reference,
      demandeurs: demandeur, // correspond à la colonne "demandeurs" dans la table MySQL
      montant: Number(montant), // Assurez-vous que c'est un nombre
      typeCredit,
      statut,
      Date: new Date(),
    };
    
    try {
      const response = await fetch('http://localhost:3001/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ajouter le token JWT dans les headers
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Demande de crédit soumise avec succès');
        // Remettre à zéro les champs après soumission
        setReference('');
        setDemandeur('');
        setMontant('');
        setTypeCredit('');
        setStatut('');
        // Rediriger vers la page de liste des demandes de crédit
        router.push('/admin/dashboard/');
      } else {
        console.error('Erreur lors de la soumission de la demande');
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6">Formulaire de Demande de Crédit</h2>

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

        <div className="mb-4">
          <label htmlFor="typeCredit" className="block text-sm font-medium text-gray-700 mb-2">
            Type de Crédit
          </label>
          <select
            id="typeCredit"
            value={typeCredit}
            onChange={(e) => setTypeCredit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un type de crédit</option>
            <option value="immobilier">Crédit Immobilier</option>
            <option value="personnel">Crédit Personnel</option>
            <option value="auto">Crédit Auto</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            id="statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un statut</option>
            <option value="En attente">En Attente</option>
            <option value="Approuvé">Approuvé</option>
            <option value="Refusé">Refusé</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Soumettre la demande
        </button>
      </form>
    </div>
  );
};

export default Demande;
