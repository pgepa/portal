import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { useAuth } from "@/Context/AuthContext";
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const loginSchema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório."),
  password: z.string().min(1, "A senha é obrigatória."),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Se já estiver logado, redireciona para a área administrativa
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as LocationState | null;
      const from = state?.from?.pathname || "/admin/sistemas";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "admin", password: "", remember: true },
  });

  async function onSubmit(values: LoginForm) {
    setError(null);
    setLoading(true);

    try {
      const result = await login(values.username, values.password, values.remember);

      if (!result.success) {
        setError(result.message || "Credenciais inválidas.");
      } else {
        const state = location.state as LocationState | null;
        const from = state?.from?.pathname || "/admin/sistemas";
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ocorreu um erro inesperado ao autenticar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet title="Login Administrativo" />
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-50 font-sans">
        {/* Coluna da Esquerda: Branding Institucional */}
        <div className="hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 lg:flex flex-col items-center justify-between p-12 text-white relative overflow-hidden">
          {/* Efeitos de fundo animados */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse pointer-events-none" />

          {/* Topo: Voltar */}
          <div className="w-full flex justify-start z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Portal Público
            </Link>
          </div>

          {/* Centro: Logo e Mensagem */}
          <div className="w-full max-w-md text-center z-10 py-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
              <img className="relative h-24 w-24 mx-auto drop-shadow-2xl" src={logo} alt="Logo PGE-PA" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
              Portal PGE-PA
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Painel de Controle Administrativo
            </p>

            <p className="mt-6 text-slate-300 leading-relaxed text-sm">
              Área exclusiva para administradores da Diretoria de Tecnologia da Informação e Governança Digital (DTIGD).
              Gerencie os sistemas e links exibidos na página inicial.
            </p>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-300 flex items-start gap-3 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Acesso Restrito</p>
                <p className="text-slate-400 mt-1">
                  Usuário padrão: <strong className="text-blue-300">admin</strong> | Senha padrão: <strong className="text-blue-300">admin</strong> (ou <strong className="text-blue-300">admin123</strong>)
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé institucional */}
          <div className="w-full text-center text-xs text-slate-400 z-10">
            © {new Date().getFullYear()} Procuradoria-Geral do Estado do Pará - DTIGD
          </div>
        </div>

        {/* Coluna da Direita: Formulário de Login */}
        <div className="flex flex-col justify-center items-center py-12 px-6 sm:px-12 lg:px-16 bg-slate-50 relative">
          {/* Link voltar para mobile */}
          <div className="w-full max-w-md lg:hidden mb-6 flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Portal
            </Link>
          </div>

          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mb-4 shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Autenticação de Administrador
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Entre com suas credenciais para gerenciar os sistemas do portal.
              </p>
            </div>

            <div className="bg-white p-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-100">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Acesso Negado</p>
                      <p className="mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Usuário */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-sm font-semibold text-slate-700">
                    Usuário Administrador
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="admin"
                    {...register("username")}
                    autoComplete="username"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.username ? "border-red-500" : "border-slate-300"
                    } text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-600 font-medium">{errors.username.message}</p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      autoComplete="current-password"
                      className={`w-full px-4 py-2.5 pr-11 rounded-xl border ${
                        errors.password ? "border-red-500" : "border-slate-300"
                      } text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
                  )}
                </div>

                {/* Lembrar-me */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      {...register("remember")}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>Manter conectado neste navegador</span>
                  </label>
                </div>

                {/* Botão Entrar */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 transform active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verificando credenciais...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Entrar no Painel</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
