import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSystems, SystemItem, SystemCategory } from "@/Context/SystemsContext";
import { useAuth } from "@/Context/AuthContext";
import { SystemLogo } from "@/components/ui/SystemLogo";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  RotateCcw,
  Eye,
  Shield,
  Layers,
  Link2,
  AlertTriangle,
  LogOut,
  Upload,
  Link as LinkIcon,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import defaultLogo from "@/assets/logo.svg";
import imgContrato from "@/assets/contrato.png";
import imgNuvem from "@/assets/nuvem.png";
import imgSuporte from "@/assets/suporte.png";
import imgSida from "@/assets/logosida.png";
import imgBusca from "@/assets/busca.png";
import imgLex from "@/assets/pcon.png";
import imgBanco from "@/assets/armazenamento-de-banco-de-dados.png";
import imgAttus from "@/assets/attus.png";
import imgZimbra from "@/assets/zimbra.png";
import imgPje from "@/assets/pje.png";
import { toast } from "sonner";

/**
 * Sanitiza e extrai URL de imagem, tratando URLs do Google Imagens e aspas extras
 */
function sanitizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  let url = rawUrl.trim();

  // Remove aspas no início e no fim caso o usuário tenha colado com aspas
  url = url.replace(/^["']|["']$/g, "").trim();

  // Se o usuário colou link de redirecionamento do Google Imagens
  if (url.includes("google.com/imgres") || (url.includes("google.") && url.includes("imgurl="))) {
    try {
      const parsed = new URL(url);
      const actualImg = parsed.searchParams.get("imgurl");
      if (actualImg) {
        url = decodeURIComponent(actualImg);
      }
    } catch {
      // mantém a original se falhar o parse
    }
  }

  return url;
}

const PRESET_LOGOS = [
  { label: "Brasão PGE", url: defaultLogo },
  { label: "Contratos / Jurídico", url: imgContrato },
  { label: "Nuvem / Arquivos", url: imgNuvem },
  { label: "Suporte TI", url: imgSuporte },
  { label: "SIDA / Dívida", url: imgSida },
  { label: "Busca / Pesquisa", url: imgBusca },
  { label: "Legislação", url: imgLex },
  { label: "Banco de Dados", url: imgBanco },
  { label: "Processos (Attus)", url: imgAttus },
  { label: "E-mail (Zimbra)", url: imgZimbra },
  { label: "PJE", url: imgPje },
];

export default function ManageSystemsPage() {
  const { systems, pgeSystems, utilSystems, addSystem, removeSystem, updateSystem, resetToDefault } = useSystems();
  const { logout } = useAuth();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "pge" | "util">("all");

  // Estados dos Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemItem | null>(null);
  const [systemToDelete, setSystemToDelete] = useState<SystemItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State para Novo / Edição
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formExternalLink, setFormExternalLink] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState<SystemCategory>("pge");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtragem dos sistemas
  const filteredSystems = systems.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.externalLink.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const openCreateModal = () => {
    setFormTitle("");
    setFormDescription("");
    setFormExternalLink("");
    setFormImage("");
    setFormCategory("pge");
    setIsCreateOpen(true);
  };

  const openEditModal = (item: SystemItem) => {
    setEditingSystem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormExternalLink(item.externalLink);
    setFormImage(item.image);
    setFormCategory(item.category);
  };

  // Upload local de arquivo para Base64 (garante 100% de funcionamento offline/online)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.warning("A imagem selecionada é maior que 2MB. Recomendamos arquivos menores para melhor performance.");
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormImage(reader.result);
        toast.success("Imagem carregada do seu dispositivo com sucesso!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim() || !formExternalLink.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const cleanedImage = sanitizeImageUrl(formImage) || defaultLogo;

    addSystem({
      title: formTitle.trim(),
      description: formDescription.trim(),
      externalLink: formExternalLink.trim(),
      image: cleanedImage,
      category: formCategory,
    });

    toast.success(`Sistema "${formTitle}" adicionado com sucesso à página inicial!`);
    setIsCreateOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSystem) return;
    if (!formTitle.trim() || !formDescription.trim() || !formExternalLink.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const cleanedImage = sanitizeImageUrl(formImage) || defaultLogo;

    updateSystem(editingSystem.id, {
      title: formTitle.trim(),
      description: formDescription.trim(),
      externalLink: formExternalLink.trim(),
      image: cleanedImage,
      category: formCategory,
    });

    toast.success(`Sistema "${formTitle}" atualizado com sucesso!`);
    setEditingSystem(null);
  };

  const handleConfirmDelete = () => {
    if (!systemToDelete) return;
    removeSystem(systemToDelete.id);
    toast.success(`Sistema "${systemToDelete.title}" removido da página inicial.`);
    setSystemToDelete(null);
  };

  const handleConfirmReset = () => {
    resetToDefault();
    toast.info("A lista de sistemas foi restaurada para o padrão oficial da PGE-PA.");
    setIsResetConfirmOpen(false);
  };

  // Renderizador dos campos de imagem compartilhado entre Criar e Editar
  const renderImageInputs = () => {
    const isBase64 = formImage.startsWith("data:image");
    const isExternalUrl = formImage.startsWith("http://") || formImage.startsWith("https://");

    return (
      <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
            Logo / Imagem do Sistema
          </Label>

          {formImage && (
            <button
              type="button"
              onClick={() => setFormImage("")}
              className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Restaurar Padrão
            </button>
          )}
        </div>

        {/* Campo de URL */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Cole a URL da imagem (https://...)"
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
            className="rounded-xl flex-1 bg-white text-xs"
          />

          {/* Botão de Upload do Computador */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl shrink-0 text-xs flex items-center gap-1.5 border-slate-300 hover:bg-blue-50 hover:text-blue-700"
            title="Escolha um arquivo do seu computador"
          >
            <Upload className="w-3.5 h-3.5" />
            Carregar do PC
          </Button>
        </div>

        {/* Visualização Prévia e Status */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
            <SystemLogo
              src={formImage}
              alt="Pré-visualização"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-xs text-slate-600 flex-1">
            <p className="font-semibold text-slate-800">
              {isBase64
                ? "✓ Arquivo carregado do dispositivo (Base64)"
                : isExternalUrl
                ? "✓ Imagem vinculada via URL externa"
                : formImage
                ? "✓ Logo do sistema configurada"
                : "Usando Brasão Oficial da PGE-PA (Padrão)"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Suporta links da web (PNG, JPG, SVG, WebP) ou uploads diretos do computador.
            </p>
          </div>
        </div>

        {/* Galeria de Logos Rápidas da PGE */}
        <div className="pt-2 border-t border-slate-200/80">
          <p className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Ou selecione uma logo oficial do portal:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {PRESET_LOGOS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setFormImage(preset.url)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  formImage === preset.url
                    ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <img src={preset.url} alt="" className="w-3.5 h-3.5 object-contain" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet title="Gerenciar Sistemas | Painel Admin" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Top Header Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                Painel Administrativo
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Gerenciamento de Sistemas da Home
              </h1>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
                Adicione novos sistemas, edite informações ou remova sistemas antigos da página inicial do portal.
                As alterações e novas imagens são refletidas imediatamente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/">
                <Button variant="outline" className="rounded-xl flex items-center gap-2 border-slate-300 hover:bg-white/60">
                  <Eye className="w-4 h-4" />
                  Ver Página Inicial
                </Button>
              </Link>

              <Button
                onClick={openCreateModal}
                className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Novo Sistema
              </Button>

              <Button
                variant="ghost"
                onClick={logout}
                className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                title="Encerrar sessão de administrador"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas / Cards de Contagem */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Total de Sistemas</p>
              <h3 className="text-2xl font-black text-slate-900">{systems.length}</h3>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Sistemas PGE-PA</p>
              <h3 className="text-2xl font-black text-slate-900">{pgeSystems.length}</h3>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Links Úteis</p>
              <h3 className="text-2xl font-black text-slate-900">{utilSystems.length}</h3>
            </div>
          </div>
        </div>

        {/* Barra de Filtro e Ações Secundárias */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Buscar por nome, descrição ou URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl bg-white/70 border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-200/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos ({systems.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("pge")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === "pge" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PGE ({pgeSystems.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("util")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === "util" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Úteis ({utilSystems.length})
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="rounded-xl text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1.5 border-slate-300"
              title="Restaurar lista original de sistemas padrão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrões
            </Button>
          </div>
        </div>

        {/* Lista de Sistemas em Grid */}
        {filteredSystems.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-white/30 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nenhum sistema encontrado</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Nenhum item corresponde à busca atual. Tente alterar os termos ou adicione um novo sistema.
            </p>
            <Button onClick={openCreateModal} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Sistema
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSystems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-white/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Imagem do Sistema com SystemLogo */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-100 p-2 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <SystemLogo
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Categoria Badge */}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        item.category === "pge"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {item.category === "pge" ? "Sistema PGE" : "Link Útil"}
                    </span>
                  </div>

                  {/* Informações */}
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed" title={item.description}>
                    {item.description}
                  </p>

                  {/* Link externo */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 break-all">
                    <a
                      href={item.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline max-w-full truncate"
                      title={item.externalLink}
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.externalLink}</span>
                    </a>
                  </div>
                </div>

                {/* Ações */}
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(item)}
                    className="rounded-lg h-8 px-3 text-xs flex items-center gap-1.5 border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSystemToDelete(item)}
                    className="rounded-lg h-8 px-3 text-xs flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Criar Novo Sistema */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Adicionar Novo Sistema
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Preencha os dados do sistema para que ele apareça imediatamente na página inicial do portal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-title" className="text-xs font-bold text-slate-700 uppercase">
                Título do Sistema *
              </Label>
              <Input
                id="create-title"
                placeholder="Ex: SIGESCON, SIDA, e-PGE..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-category" className="text-xs font-bold text-slate-700 uppercase">
                Categoria de Exibição *
              </Label>
              <select
                id="create-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as SystemCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="pge">Sistemas PGE-PA (Grid Principal)</option>
                <option value="util">Links Úteis (Grid Secundário)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-link" className="text-xs font-bold text-slate-700 uppercase">
                URL / Link Externo *
              </Label>
              <Input
                id="create-link"
                placeholder="https://exemplo.pge.pa.gov.br"
                value={formExternalLink}
                onChange={(e) => setFormExternalLink(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            {/* Inputs de Imagem Avançados */}
            {renderImageInputs()}

            <div className="space-y-1.5">
              <Label htmlFor="create-description" className="text-xs font-bold text-slate-700 uppercase">
                Descrição do Sistema *
              </Label>
              <textarea
                id="create-description"
                rows={3}
                placeholder="Breve descrição do objetivo do sistema..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Salvar Sistema
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Editar Sistema Existente */}
      <Dialog open={!!editingSystem} onOpenChange={(open) => !open && setEditingSystem(null)}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Editar Sistema: {editingSystem?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Atualize as informações do sistema e sua logo conforme necessário.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title" className="text-xs font-bold text-slate-700 uppercase">
                Título do Sistema *
              </Label>
              <Input
                id="edit-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-category" className="text-xs font-bold text-slate-700 uppercase">
                Categoria de Exibição *
              </Label>
              <select
                id="edit-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as SystemCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="pge">Sistemas PGE-PA (Grid Principal)</option>
                <option value="util">Links Úteis (Grid Secundário)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-link" className="text-xs font-bold text-slate-700 uppercase">
                URL / Link Externo *
              </Label>
              <Input
                id="edit-link"
                value={formExternalLink}
                onChange={(e) => setFormExternalLink(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            {/* Inputs de Imagem Avançados */}
            {renderImageInputs()}

            <div className="space-y-1.5">
              <Label htmlFor="edit-description" className="text-xs font-bold text-slate-700 uppercase">
                Descrição do Sistema *
              </Label>
              <textarea
                id="edit-description"
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingSystem(null)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Confirmação de Remoção */}
      <Dialog open={!!systemToDelete} onOpenChange={(open) => !open && setSystemToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Remover "{systemToDelete?.title}"?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Tem certeza de que deseja remover este sistema da página inicial? Esta ação pode ser revertida
              restaurando os padrões ou cadastrando-o novamente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setSystemToDelete(null)} className="rounded-xl">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, Remover Sistema
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Confirmação de Restaurar Padrões */}
      <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <RotateCcw className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Restaurar Lista Padrão de Sistemas?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Esta ação irá redefinir todos os sistemas para a lista oficial original da PGE-PA, descartando sistemas
              adicionados ou alterações manuais recentes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReset}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
              Confirmar Restauração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
