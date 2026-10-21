import { useState } from "react";
import { BookOpen, Home, Menu, Phone, LogIn, LogOut, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.svg";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Sessão administrativa encerrada com sucesso.");
    navigate("/");
    closeMenu();
  };

  return (
    <div className={`glass-header border-b border-white/20 relative z-50 ${isMenuOpen ? "mb-20 sm:mb-14" : ""}`}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 w-full max-w-7xl mx-auto">
        {/* Logo e Nome Institucional */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-4 animate-slideIn group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse" />
              <img
                src={Logo}
                alt="Logo PGE-PA"
                className="relative mx-auto h-11 w-11 drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="gradient-text text-xl sm:text-2xl font-black tracking-tight">
                SISTEMAS PGE
              </span>
              <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                Procuradoria-Geral do Estado do Pará
              </span>
            </div>
          </Link>
          <Separator
            orientation="vertical"
            className="h-8 hidden lg:block bg-gradient-to-b from-transparent via-slate-300/50 to-transparent"
          />
        </div>

        {/* Menu Navigation Desktop */}
        <nav className="hidden lg:flex items-center space-x-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 shadow-sm"
                  : "text-slate-700 hover:text-blue-600 hover:bg-white/40"
              }`
            }
          >
            <Home className="h-4 w-4" />
            Home
          </NavLink>

          <NavLink
            to="/ramais"
            className={({ isActive }) =>
              `flex items-center gap-2 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 shadow-sm"
                  : "text-slate-700 hover:text-blue-600 hover:bg-white/40"
              }`
            }
          >
            <Phone className="h-4 w-4" />
            Ramais
          </NavLink>

          <NavLink
            to="/manuais"
            className={({ isActive }) =>
              `flex items-center gap-2 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 shadow-sm"
                  : "text-slate-700 hover:text-blue-600 hover:bg-white/40"
              }`
            }
          >
            <BookOpen className="h-4 w-4" />
            Manuais
          </NavLink>
        </nav>

        {/* Card / Botão de Acesso Administrativo (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-blue-200/60 rounded-2xl p-1.5 shadow-sm">
              <Link
                to="/admin/sistemas"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Gerenciar Sistemas</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                title="Sair do modo administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="group relative flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 hover:bg-white/90 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-semibold text-xs shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors">
                <LogIn className="w-3.5 h-3.5" />
              </div>
              <span>Login Admin</span>
            </Link>
          )}
        </div>

        {/* Botão Hambúrguer Mobile */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-white/40 transition-all text-slate-700"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Menu Navigation Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden glass-header border-t border-white/20 px-6 py-4 space-y-3 animate-fadeIn shadow-xl">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5 font-semibold text-sm text-slate-700 hover:text-blue-600 p-2 rounded-xl hover:bg-white/40"
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>
            <NavLink
              to="/ramais"
              onClick={closeMenu}
              className="flex items-center gap-2.5 font-semibold text-sm text-slate-700 hover:text-blue-600 p-2 rounded-xl hover:bg-white/40"
            >
              <Phone className="h-4 w-4" />
              Ramais
            </NavLink>
            <NavLink
              to="/manuais"
              onClick={closeMenu}
              className="flex items-center gap-2.5 font-semibold text-sm text-slate-700 hover:text-blue-600 p-2 rounded-xl hover:bg-white/40"
            >
              <BookOpen className="h-4 w-4" />
              Manuais
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-slate-200/60">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/admin/sistemas"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md"
                >
                  <Settings className="w-4 h-4" />
                  Gerenciar Sistemas
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Encerrar Sessão
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Login de Administrador
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
