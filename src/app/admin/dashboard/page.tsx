import React from 'react';

const Dashboard: React.FC = () => {
  // Données factices pour les demandes de crédit
  const creditRequests = [
    {
      id: 1,
      client: 'Jean Dupont',
      amount: 1500000,
      status: 'Approuvé',
      date: '2024-09-15',
    },
    {
      id: 2,
      client: 'ibrahim sow',
      amount: 3000000,
      status: 'En attente',
      date: '2024-09-20',
    },
    {
      id: 3,
      client: 'fred kouamé',
      amount: 500000,
      status: 'Refusé',
      date: '2024-09-25',
    },
    {
      id: 4,
      client: 'mariam keita',
      amount: 2500000,
      status: 'Approuvé',
      date: '2024-09-27',
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord - Demandes de Crédit</h1>
      
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total des Demandes</h2>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Approuvé</h2>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total en Attente...</h2>
          <p className="text-2xl font-bold">1</p>
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
            {creditRequests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="px-4 py-2">{request.client}</td>
                <td className="px-4 py-2">{request.amount.toLocaleString()} F CFA</td>
                <td className={`px-4 py-2 ${
                  request.status === 'Approuvé' ? 'text-green-500' :
                  request.status === 'Refusé' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {request.status}
                </td>
                <td className="px-4 py-2">{request.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;