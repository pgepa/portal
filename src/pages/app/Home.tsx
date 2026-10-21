import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CircleHelp, Link2, Settings } from "lucide-react";
import { SystemLogo } from "@/components/ui/SystemLogo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSystems, SystemItem } from "@/Context/SystemsContext";
import { useAuth } from "@/Context/AuthContext";

export function Home() {
  const { pgeSystems, utilSystems, systems } = useSystems();
  const { isAuthenticated } = useAuth();

  // Componente interno do cartão
  const CardContent = ({ card }: { card: SystemItem }) => (
    <>
      <span className="sr-only">{card.description}</span>

      <div className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 w-[calc(100%-1rem)] -translate-x-1/2 rounded-xl bg-slate-900/95 px-3 py-2 text-xs font-medium text-white text-center opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:mb-3 group-hover:opacity-100 group-focus-visible:mb-3 group-focus-visible:opacity-100">
        {card.description}
      </div>

      <div className="relative z-10 w-16 h-16 shrink-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-3 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
        <SystemLogo
          src={card.image}
          alt={card.title}
          className="w-full h-full object-contain animate-float"
        />
      </div>

      <div className="relative z-10 ml-5 flex-1 overflow-hidden text-left">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {card.title}
        </h3>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </>
  );

  // Função para renderizar as grades dinamicamente
  const renderGrid = (cards: SystemItem[], gridClasses: string) => (
    <div className={`grid gap-x-6 gap-y-8 w-full ${gridClasses}`}>
      {cards.map((card, index) => {
        const cardClasses = `group relative glass-card rounded-2xl p-6 flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-full`;

        return (
          <div
            key={card.id || index}
            className="animate-slideIn w-full relative"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            {card.externalLink ? (
              <a
                href={card.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClasses}
              >
                <CardContent card={card} />
              </a>
            ) : (
              <Link to="/" className={cardClasses}>
                <CardContent card={card} />
              </Link>
            )}

            {/* Popover Mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="sm:hidden absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-white/90 text-slate-600 border border-slate-200 shadow-sm flex items-center justify-center"
                  aria-label={`Ver descrição de ${card.title}`}
                >
                  <CircleHelp className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="sm:hidden w-64 text-sm"
              >
                {card.description}
              </PopoverContent>
            </Popover>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <Helmet title="Home" />
      {/* min-h-screen e pb-24 permitem scroll elegante devido ao volume de cartões */}
      <div className="relative w-full flex flex-col pt-6 px-4 min-h-screen pb-24">
        <div className="max-w-7xl w-full mx-auto flex flex-col h-full">
          {/* Header Section */}
          <div className="text-center mb-12 animate-slideIn shrink-0">
            <h1 className="text-5xl md:text-5xl font-extrabold gradient-text mb-4 animate-scaleIn">
              Sistemas PGE-PA
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fadeIn">
              Sistemas da Procuradoria-Geral do Estado do Pará
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full animate-scaleIn" />
          </div>

          {/* Grid Principal (Sistemas PGE-PA) */}
          {renderGrid(
            pgeSystems,
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}

          {/* Separador Moderno (Badge Divisor) */}
          <div
            className="w-full mt-10 mb-10 animate-slideIn"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-slate-300" />
              <div className="px-5 py-2.5 rounded-full border border-slate-200/60 bg-white/60 backdrop-blur-md text-slate-600 text-sm font-bold tracking-widest uppercase flex items-center gap-2 shadow-sm">
                <Link2 className="w-5 h-5 text-blue-500" />
                Links Úteis
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-300 to-slate-300" />
            </div>
          </div>

          {/* Grid Secundário (Links Úteis) */}
          {renderGrid(
            utilSystems,
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        </div>

        {/* Floating Quick Action para Administrador */}
        {isAuthenticated && (
          <div className="fixed bottom-24 right-8 z-30 animate-fadeIn">
            <Link
              to="/admin/sistemas"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-500/30 hover:scale-105 transition-all duration-300"
            >
              <Settings className="w-4 h-4 animate-spin-slow" />
              <span>Gerenciar Sistemas</span>
            </Link>
          </div>
        )}

        {/* Footer Flutuante com Contagem Atualizada */}
        <div className="fixed bottom-8 right-8 z-20">
          <div className="glass rounded-2xl p-4 animate-float shadow-sm border border-white/40">
            <div className="gradient-text font-bold text-sm">
              {systems.length} Sistemas Disponíveis
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
