import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="text-7xl mb-4 text-blue-600 font-bold">404</div>
        <div className="mb-2 text-2xl font-semibold text-gray-800">Página no encontrada</div>
        <div className="mb-6 text-gray-500 text-center max-w-xs">La página que buscas no existe o fue movida. Si crees que es un error, contáctanos.</div>
        <button
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
      <div className="mt-8 opacity-60">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="30" fill="#3b82f6"/>
          <text x="50%" y="54%" textAnchor="middle" fill="white" fontSize="32" fontFamily="Arial" dy=".3em">S</text>
        </svg>
      </div>
    </div>
  );
};

export default Error404; 