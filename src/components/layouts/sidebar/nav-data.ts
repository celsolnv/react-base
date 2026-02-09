import {
  // BarChart3,
  // Calendar,
  // Car,
  // FileText,
  // FolderOpen,
  // LayoutDashboard,
  // Lightbulb,
  type LucideIcon,
  // Package,
  // Settings,
  ShieldCheck,
  // UserCircle,
  UserCog,
  // Users,
  // Wallet,
  // Wrench,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationData: NavSection[] = [
  // {
  //   title: "Principal",
  //   items: [
  //     // { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  //     // { title: "Veículos", href: "/veiculos", icon: Car },
  //     // { title: "Clientes", href: "/clientes", icon: Users },
  //     // { title: "Fornecedores", href: "/suppliers", icon: Package },
  //     // { title: "Clientes", href: "/customers", icon: Users },
  //     // { title: "Motoristas", href: "/drivers", icon: UserCircle },
  //     // { title: "Marcas e Modelos", href: "/marcas", icon: Car },
  //     // { title: "Categorias de Veículos", href: "/categorias-veiculos", icon: FolderOpen },
  //     // { title: "Reservas", href: "/reservas", icon: Calendar },
  //   ],
  // },
  // {
  //   title: "Gestao",
  //   items: [
  //     { title: "Manutenções", href: "/manutencao", icon: Wrench },
  //     { title: "Contratos", href: "/contratos", icon: FileText },
  //     { title: "Financeiro", href: "/financeiro", icon: Wallet },
  //     { title: "Relatorios", href: "/relatorios", icon: BarChart3 },
  //   ],
  // },
  {
    title: "Sistema",
    items: [
      // { title: "Insights", href: "/insights", icon: Lightbulb },
      { title: "Niveis de Acesso", href: "/nivel-acesso", icon: ShieldCheck },
      { title: "Usuarios", href: "/usuarios", icon: UserCog },
      // { title: "Configuracoes", href: "/configuracoes", icon: Settings },
    ],
  },
];
