'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const router = useRouter(); // Utilisé pour la redirection

  const [creditRequests, setCreditRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchCreditRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/credits');
      const data = await response.json();
      setCreditRequests(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de crédits:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCreditRequests();
  }, []);

  if (loading) {
    return <p>Chargement des demandes de crédits...</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord - Demandes de Crédit</h1>
      
      <button
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded-lg"
        onClick={() => router.push('/admin/dashboard/demandes')}
      >
        Nouvelle Demande de Crédit
      </button>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total des Demandes</h2>
          <p className="text-2xl font-bold">{creditRequests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Approuvé</h2>
          <p className="text-2xl font-bold">
            {creditRequests.filter((req: any) => req.statut === 'Approuvé').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total en Attente...</h2>
          <p className="text-2xl font-bold">
            {creditRequests.filter((req: any) => req.statut === 'En attente').length}
          </p>
        </div>
      </div>

      {/* Tableau des demandes de crédit */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Liste des Demandes de Crédit</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Montant (F CFA)</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {creditRequests.map((request: any) => (
              <tr key={request.id_credit} className="border-t">
                <td className="px-4 py-2">{request.demandeurs}</td>
                <td className="px-4 py-2">{parseFloat(request.montant).toLocaleString()} F CFA</td>
                <td className={`px-4 py-2 ${
                  request.statut === 'Approuvé' ? 'text-green-500' :
                  request.statut === 'Refusé' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {request.statut}
                </td>
                <td className="px-4 py-2">{new Date(request.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
