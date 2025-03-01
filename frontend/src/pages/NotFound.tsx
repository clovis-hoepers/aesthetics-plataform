import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Ouve um erro ao tentar acessar a página, entre em contato pelo Whatsapp",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Ouve um erro ao tentar acessar a página, entre em contato pelo Whatsapp</p>
      </div>
    </div>
  );
};

export default NotFound;
