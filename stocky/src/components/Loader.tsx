import boxyLogo from '../assets/boxy.svg';

const Loader = ({ message = 'Cargando...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
    <div className="animate-spin-slow mb-6">
      <img src={boxyLogo} alt="Stocky logo" className="h-24 w-24" />
    </div>
    <span className="text-blue-700 text-lg font-semibold tracking-wide drop-shadow">{message}</span>
    <style>{`
      .animate-spin-slow {
        animation: spin 1.6s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader; 