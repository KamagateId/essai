'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface CreditRequest {
  reference: string;
  demandeurs: string;
  montant: number;
  type_de_credit: string;
  statut: string;
}

const EditCreditRequest: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Récupère le chemin de l'URL
  const id = pathname.split('/').pop(); // Extrait l'ID de la demande de crédit depuis l'URL
  const [creditRequest, setCreditRequest] = useState<CreditRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<CreditRequest>({
    reference: '',
    demandeurs: '',
    montant: 0,
    type_de_credit: '',
    statut: '',
  });

  useEffect(() => {
    if (id) {
      const fetchCreditRequest = async () => {
        const token = localStorage.getItem('token');
        const fetchUrl = `http://localhost:3001/credits/${id}`;
        console.log(`Fetching credit request from: ${fetchUrl}`); // Debug log
  
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data: CreditRequest = await response.json();
          setCreditRequest(data);
          setFormData({
            reference: data.reference,
            demandeurs: data.demandeurs,
            montant: data.montant,
            type_de_credit: data.type_de_credit,
            statut: data.statut,
          });
          setLoading(false);
        } else {
          console.error('Erreur lors de la récupération de la demande de crédit', response.status); // Log response status
          alert('Erreur lors de la récupération de la demande de crédit');
          setLoading(false);
        }
      };
  
      fetchCreditRequest();
    }
  }, [id]); // Exécute cet effet uniquement lorsque l'ID change
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3001/credits/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Demande de crédit mise à jour avec succès');
      router.push('/admin/dashboard/demandes'); // Redirige vers la liste des demandes de crédit
    } else {
      console.error('Erreur lors de la mise à jour de la demande de crédit');
      alert('Erreur lors de la mise à jour de la demande de crédit');
    }
  };

  if (loading) {
    return <div>Chargement...</div>; // Affiche un message de chargement pendant que les données se chargent
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Modifier la demande de crédit</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block mb-1">Référence</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Demandeurs</label>
          <input
            type="text"
            name="demandeurs"
            value={formData.demandeurs}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Montant</label>
          <input
            type="number"
            name="montant"
            value={formData.montant}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Type de crédit</label>
          <input
            type="text"
            name="typeCredit"
            value={formData.type_de_credit}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Statut</label>
          <input
            type="text"
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default EditCreditRequest;
