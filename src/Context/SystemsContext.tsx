import React, { createContext, useContext, useState, useEffect } from "react";
import imgBancoPareceres from "@/assets/armazenamento-de-banco-de-dados.png";
import imgSida from "@/assets/logosida.png";
import imgLexPge from "@/assets/pcon.png";
import imgBuscaDoe from "@/assets/busca.png";
import imgSuporteDtigd from "@/assets/suporte.png";
import imgNuvem from "@/assets/nuvem.png";
import imgGdap from "@/assets/gdap.png";
import imgSigescon from "@/assets/contrato.png";
import imgEadEsap from "@/assets/ead-esap.png";
import imgNcaDigital from "@/assets/nca-digital.png";
import imgSistemasLegados from "@/assets/sistemas-legados.png";
import imgAttusPge from "@/assets/attus.png";
import imgZimbra from "@/assets/zimbra.png";
import imgPje from "@/assets/pje.png";
import imgProdepa from "@/assets/prodepa.png";
import imgBrasaoPge from "@/assets/logo.svg";
import imgTrt8 from "@/assets/trt8.png";
import imgTrf1 from "@/assets/trf1.png";
import imgIoepa from "@/assets/ioepa.png";
import imgSeplad from "@/assets/seplad.png";

export type SystemCategory = "pge" | "util";

export interface SystemItem {
  id: string;
  title: string;
  description: string;
  image: string;
  externalLink: string;
  category: SystemCategory;
  order?: number;
}

interface SystemsContextType {
  systems: SystemItem[];
  pgeSystems: SystemItem[];
  utilSystems: SystemItem[];
  addSystem: (system: Omit<SystemItem, "id">) => void;
  removeSystem: (id: string) => void;
  updateSystem: (id: string, updated: Partial<Omit<SystemItem, "id">>) => void;
  resetToDefault: () => void;
}

const SYSTEMS_STORAGE_KEY = "pge_portal_systems_data";

export const DEFAULT_SYSTEMS: SystemItem[] = [
  {
    id: "sigescon",
    title: "SIGESCON",
    description: "Sistema de Gestão de Contratos",
    image: imgSigescon,
    externalLink: "http://sigescon.pge.pa.gov.br/",
    category: "pge",
    order: 1,
  },
  {
    id: "sida",
    title: "SIDA",
    description: "Sistema de Inteligência da Procuradoria da Dívida Ativa",
    image: imgSida,
    externalLink: "https://sida.pge.pa.gov.br",
    category: "pge",
    order: 2,
  },
  {
    id: "lexpge",
    title: "LEXPGE",
    description: "Base de Atos Normativos da Procuradoria-Geral do Estado do Pará",
    image: imgLexPge,
    externalLink: "https://lex.pge.pa.gov.br/",
    category: "pge",
    order: 3,
  },
  {
    id: "busca-doe",
    title: "BUSCA DOE",
    description: "Sistema de Busca Avançado de Diários Oficiais do Estado do Pará",
    image: imgBuscaDoe,
    externalLink: "http://buscadoe.pge.pa.gov.br/",
    category: "pge",
    order: 4,
  },
  {
    id: "suporte-dti",
    title: "SUPORTE DTI",
    description: "Sistema de Suporte da Diretoria de Tecnologia da Informação",
    image: imgSuporteDtigd,
    externalLink: "https://suportedti.pge.pa.gov.br/",
    category: "pge",
    order: 5,
  },
  {
    id: "cloud-pge",
    title: "CLOUD PGE",
    description: "Sistema de Armazenamento de Arquivos da Procuradoria-Geral do Estado do Pará",
    image: imgNuvem,
    externalLink: "https://cloud.pge.pa.gov.br/",
    category: "pge",
    order: 6,
  },
  {
    id: "gdap",
    title: "GDAP",
    description: "Gratificação de Desempenho de Apoio à Procuradoria",
    image: imgGdap,
    externalLink: "https://gdap.pge.pa.gov.br/",
    category: "pge",
    order: 7,
  },
  {
    id: "e-consulta",
    title: "e-CONSULTA",
    description: "Sistema de Consulta de Processos do e-PGE",
    image: imgBancoPareceres,
    externalLink: "http://10.96.0.54:4000",
    category: "pge",
    order: 8,
  },
  {
    id: "ead-esap",
    title: "EAD ESAP",
    description: "Plataforma de Ensino a Distância da ESAP",
    image: imgEadEsap,
    externalLink: "https://eadesap.pge.pa.gov.br",
    category: "pge",
    order: 9,
  },
  {
    id: "nca-digital",
    title: "NCA DIGITAL",
    description: "Plataforma para gerenciamento de solicitações de Análise de Prescrição e Carta de Anuência",
    image: imgNcaDigital,
    externalLink: "https://nca.pge.pa.gov.br",
    category: "pge",
    order: 10,
  },
  {
    id: "sistemas-legados",
    title: "SISTEMAS LEGADOS",
    description: "Plataforma Integrada de Sistemas Legados",
    image: imgSistemasLegados,
    externalLink: "http://10.96.0.29:2000/",
    category: "pge",
    order: 11,
  },
  // Links Úteis
  {
    id: "attus-pge",
    title: "ATTUS PGE",
    description: "Sistema de apoio à gestão de processos jurídicos e execução fiscal",
    image: imgAttusPge,
    externalLink: "https://pgepa.attus.ai/",
    category: "util",
    order: 1,
  },
  {
    id: "site-pge",
    title: "SITE PGE",
    description: "Portal institucional da Procuradoria-Geral do Estado do Pará",
    image: imgBrasaoPge,
    externalLink: "https://www.pge.pa.gov.br/",
    category: "util",
    order: 2,
  },
  {
    id: "zimbra",
    title: "ZIMBRA",
    description: "Plataforma de e-mail e colaboração corporativa da Procuradoria-Geral do Estado do Pará",
    image: imgZimbra,
    externalLink: "https://mail.pa.gov.br/",
    category: "util",
    order: 3,
  },
  {
    id: "governo-digital",
    title: "GOVERNO DIGITAL",
    description: "Sistema de centralização dos sistemas do Governo do Pará",
    image: imgProdepa,
    externalLink: "https://sistemas.pa.gov.br/",
    category: "util",
    order: 4,
  },
  {
    id: "pje-tjpa",
    title: "PJE TJPA",
    description: "Sistema de tramitação de processos judiciais eletrônicos",
    image: imgPje,
    externalLink: "https://www.tjpa.jus.br/PortalExterno/institucional/Portal-PJE/942-Apresentacao.xhtml",
    category: "util",
    order: 5,
  },
  {
    id: "pje-trt8",
    title: "PJE TRT8",
    description: "Sistema eletrônico de processos judiciais do TRT8",
    image: imgTrt8,
    externalLink: "https://www.trt8.jus.br/pje",
    category: "util",
    order: 6,
  },
  {
    id: "pje-trf1",
    title: "PJE TRF1",
    description: "Sistema eletrônico de processos judiciais do TRF1",
    image: imgTrf1,
    externalLink: "https://www.trf1.jus.br/sjpa/home/",
    category: "util",
    order: 7,
  },
  {
    id: "ioepa",
    title: "IOEPA",
    description: "Imprensa Oficial do Estado do Pará, responsável pela publicação e divulgação dos atos oficiais do governo estadual.",
    image: imgIoepa,
    externalLink: "https://www.ioepa.com.br/portal/",
    category: "util",
    order: 8,
  },
  {
    id: "seplad-contracheque",
    title: "SEPLAD CONTRACHEQUE",
    description: "Sistema de consulta ao contracheque da SEPLAD",
    image: imgSeplad,
    externalLink: "https://www.sistemas.pa.gov.br/portaldoservidor-sistemas/form_login.php?s=Y29udHJhY2hlcXVl",
    category: "util",
    order: 9,
  },
];

const SystemsContext = createContext<SystemsContextType | undefined>(undefined);

export const SystemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systems, setSystems] = useState<SystemItem[]>(() => {
    const saved = localStorage.getItem(SYSTEMS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback para padrão
      }
    }
    return DEFAULT_SYSTEMS;
  });

  useEffect(() => {
    localStorage.setItem(SYSTEMS_STORAGE_KEY, JSON.stringify(systems));
  }, [systems]);

  const pgeSystems = systems.filter((s) => s.category === "pge");
  const utilSystems = systems.filter((s) => s.category === "util");

  const addSystem = (systemData: Omit<SystemItem, "id">) => {
    const newSystem: SystemItem = {
      ...systemData,
      id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: 1,
    };
    setSystems((prev) => [newSystem, ...prev]);
  };

  const removeSystem = (id: string) => {
    setSystems((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSystem = (id: string, updated: Partial<Omit<SystemItem, "id">>) => {
    setSystems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const resetToDefault = () => {
    setSystems(DEFAULT_SYSTEMS);
    localStorage.setItem(SYSTEMS_STORAGE_KEY, JSON.stringify(DEFAULT_SYSTEMS));
  };

  return (
    <SystemsContext.Provider
      value={{
        systems,
        pgeSystems,
        utilSystems,
        addSystem,
        removeSystem,
        updateSystem,
        resetToDefault,
      }}
    >
      {children}
    </SystemsContext.Provider>
  );
};

export const useSystems = () => {
  const context = useContext(SystemsContext);
  if (!context) {
    throw new Error("useSystems deve ser utilizado dentro de um SystemsProvider");
  }
  return context;
};
