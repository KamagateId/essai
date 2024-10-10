"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Connexion réussie');
        console.log('Utilisateur:', data.user);
        // Redirige l'utilisateur ou fais autre chose avec les données
        router.replace('/admin/dashboard')
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur réseau est survenue');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6">Connexion</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
