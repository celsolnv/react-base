import {
  Car,
  FolderOpen,
  Lightbulb,
  // BarChart3,
  // Calendar,
  // Car,
  // FileText,
  // FolderOpen,
  // LayoutDashboard,
  // Lightbulb,
  type LucideIcon,
  Package,
  // Settings,
  ShieldCheck,
  UserCircle,
  // UserCircle,
  UserCog,
  Users,
  // Users,
  // Wallet,
  // Wrench,
} from "lucide-react";

export interface INavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  permission?: string; // Permissão necessária para visualizar o item (ex: "client.index")
}

export interface INavSection {
  title: string;
  items: INavItem[];
}

export const navigationData: INavSection[] = [
  {
    title: "Principal",
    items: [
      // { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      // { title: "Veículos", href: "/veiculos", icon: Car },
      {
        title: "Clientes",
        href: "/clientes",
        icon: Users,
        permission: "client.index",
      },
      {
        title: "Fornecedores",
        href: "/fornecedores",
        icon: Package,
        permission: "supplier.index",
      },
      // { title: "Clientes", href: "/customers", icon: Users },
      {
        title: "Motoristas",
        href: "/motoristas",
        icon: UserCircle,
        permission: "driver.index",
      },
      // { title: "Marcas e Modelos", href: "/marcas", icon: Car },
      // { title: "Categorias de Veículos", href: "/categorias-veiculos", icon: FolderOpen },
      // { title: "Motoristas", href: "/drivers", icon: UserCircle },
      {
        title: "Marcas e Modelos",
        href: "/marcas",
        icon: Car,
        permission: "brand_models.index",
      },
      {
        title: "Categorias de Veículos",
        href: "/categorias-veiculos",
        icon: FolderOpen,
        permission: "vehicle_category.index",
      },
      // { title: "Reservas", href: "/reservas", icon: Calendar },
    ],
  },
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
      {
        title: "Insights",
        href: "/insight",
        icon: Lightbulb,
        permission: "insight.index",
      },
      {
        title: "Niveis de Acesso",
        href: "/nivel-acesso",
        icon: ShieldCheck,
        permission: "access_profile.index",
      },
      {
        title: "Usuarios",
        href: "/usuarios",
        icon: UserCog,
        permission: "user.index",
      },
      // { title: "Configuracoes", href: "/configuracoes", icon: Settings },
    ],
  },
];
