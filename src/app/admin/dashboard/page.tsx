'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [creditRequests, setCreditRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchCreditRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/credits', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes de crédits');
      }
      const data = await response.json();
      setCreditRequests(data);
      console.log(data);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total des Demandes</h2>
          <p className="text-2xl font-bold">{creditRequests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Approuvé</h2>
          <p className="text-2xl font-bold">
            {creditRequests.filter((req) => req.statut.toLowerCase() === 'approuvé').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total en Attente</h2>
          <p className="text-2xl font-bold">
            {creditRequests.filter((req) => req.statut.toLowerCase() === 'en attente').length}
          </p>
        </div>
      </div>

      {/* Tableau des demandes de crédit */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Liste des Demandes de Crédit</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Référence</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Montant (F CFA)</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creditRequests.map((request) => (
              <tr key={request.id_credit} className="border-t">
                <td className="px-4 py-2">{request.reference}</td>
                <td className="px-4 py-2">{request.demandeurs}</td>
                <td className="px-4 py-2">{parseFloat(request.montant).toLocaleString()} F CFA</td>
                <td className={`px-4 py-2 ${
                  request.statut.toLowerCase() === 'approuvé' ? 'text-green-500' :
                  request.statut.toLowerCase() === 'refusé' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {request.statut}
                </td>
                <td className="px-4 py-2">
                  {new Date(request.Date).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-lg ml-2"
                    onClick={async () => {
                      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette demande de crédit ?');
                      if (confirmed) {
                        try {
                          const token = localStorage.getItem('token');
                          await fetch(`http://localhost:3001/credits/${request.id_credit}`, {
                            method: 'DELETE',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                            },
                          });
                          setCreditRequests((prev) => prev.filter((req) => req.id_credit !== request.id_credit));
                          alert('Demande de crédit supprimée avec succès');
                        } catch (error) {
                          console.error('Erreur lors de la suppression:', error);
                          alert('Erreur lors de la suppression de la demande de crédit');
                        }
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
