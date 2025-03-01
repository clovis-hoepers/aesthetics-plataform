
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { title: "Início", path: "/" },
    { title: "Sobre", path: "/sobre" },
    { title: "Estética Facial e Corporal", path: "/servicos" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-playfair font-semibold whitespace-nowrap text-brown-100">
            Ingrid Farmaceutica Esteta
          </span>
        </Link>

        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block py-2 pl-3 pr-4 text-brown-100 hover:text-brown-200 transition-colors md:p-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/agendamentos"
                className="block py-2 pl-3 pr-4 text-brown-100 hover:text-brown-200 transition-colors md:p-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Agendamentos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
