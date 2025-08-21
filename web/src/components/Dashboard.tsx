import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { Subgrupo, ApiResponse } from '../services/api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [subgrupos, setSubgrupos] = useState<Subgrupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubgrupos();
  }, []);

  const loadSubgrupos = async () => {
    try {
      setLoading(true);
      setError('');
      const response: ApiResponse<Subgrupo[]> = await apiService.getSubgrupos();
      setSubgrupos(response.data);
    } catch (error) {
      console.error('Error cargando subgrupos:', error);
      setError('Error al cargar los subgrupos SICOIN');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Inventario</h1>
              <p className="text-blue-200">Hospital Regional de Huehuetenango</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user?.nombre}</p>
                <p className="text-blue-200 text-sm">Rol: {user?.rol}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Subgrupos SICOIN
          </h2>
          <p className="text-gray-600">
            Catálogo de subgrupos para clasificación de equipos y mobiliario
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando subgrupos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
            <button
              onClick={loadSubgrupos}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Subgrupos Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subgrupos.map((subgrupo) => (
              <div
                key={subgrupo.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {subgrupo.codigo}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {subgrupo.nombre}
                </h3>
                <p className="text-gray-600 text-sm">
                  {subgrupo.descripcion}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Creado: {new Date(subgrupo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && subgrupos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron subgrupos SICOIN</p>
          </div>
        )}

        {/* Summary */}
        {!loading && !error && subgrupos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Resumen
            </h3>
            <p className="text-gray-600">
              Total de subgrupos SICOIN: <span className="font-medium">{subgrupos.length}</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;