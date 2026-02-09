/**
 * Helper para transformação e agrupamento de permissões RBAC
 */

import type { IPermission } from "@/types/IAcessProfile";

// Re-exporta IPermission para conveniência
export type { IPermission };

export interface IPermissionAction {
  id: string;
  name: string;
  slug: string;
  type: "create" | "read" | "update" | "delete" | "extra";
}

export interface IGroupedPermissions {
  resource: string;
  displayName: string;
  actions: IPermissionAction[];
}

/**
 * Mapeia o sufixo do slug para o tipo de ação
 */
const ACTION_MAP: Record<
  string,
  { type: IPermissionAction["type"]; order: number }
> = {
  index: { type: "read", order: 1 },
  show: { type: "read", order: 1 },
  store: { type: "create", order: 2 },
  create: { type: "create", order: 2 },
  update: { type: "update", order: 3 },
  destroy: { type: "delete", order: 4 },
  delete: { type: "delete", order: 4 },
};

/**
 * Mapeia o tipo de ação para o label amigável
 */
export const ACTION_LABELS: Record<IPermissionAction["type"], string> = {
  read: "Visualizar",
  create: "Criar",
  update: "Editar",
  delete: "Excluir",
  extra: "Extra",
};

/**
 * Extrai o tipo de ação a partir do slug
 * Ex: "user.update" -> "update"
 */
function extractActionType(slug?: string): string {
  if (!slug) return "unknown";
  const parts = slug.split(".");
  return parts[parts.length - 1];
}

/**
 * Normaliza o nome do recurso para exibição
 * Ex: "user" -> "Usuários", "fleet" -> "Frota"
 */
function normalizeResourceName(resource?: string): string {
  if (!resource) return "Desconhecido";

  const resourceNames: Record<string, string> = {
    // Usuários e Acessos
    user: "Usuários",
    users: "Usuários",
    access_profiles: "Perfis de Acesso",
    access_profile: "Perfis de Acesso",
    job_roles: "Cargos",
    job_role: "Cargos",
    sectors: "Setores",
    sector: "Setores",

    // Frota
    fleet: "Frota",
    vehicle: "Veículos",
    vehicles: "Veículos",
    driver: "Motoristas",
    drivers: "Motoristas",

    // Relatórios e Financeiro
    report: "Relatórios",
    reports: "Relatórios",
    financial: "Financeiro",

    // Agendamentos e Manutenção
    schedule: "Agendamentos",
    schedules: "Agendamentos",
    maintenance: "Manutenção",

    // Outros
    company: "Empresas",
    companies: "Empresas",
    department: "Departamentos",
    departments: "Departamentos",
  };

  // Remove underscores e converte para snake_case para busca
  const normalizedKey = resource.toLowerCase().replace(/-/g, "_");

  return (
    resourceNames[normalizedKey] ||
    resourceNames[resource] ||
    resource
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

/**
 * Agrupa permissões por resource e ordena as ações
 */
export function groupPermissionsByResource(
  permissions: IPermission[]
): IGroupedPermissions[] {
  // Filtra permissões válidas (que têm resource e id)
  const validPermissions = permissions.filter((p) => p.resource && p.id);

  // Agrupa por resource
  const grouped = validPermissions.reduce(
    (acc, permission) => {
      const resource = permission.resource!;
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(permission);
      return acc;
    },
    {} as Record<string, IPermission[]>
  );

  // Transforma em array estruturado
  return Object.entries(grouped).map(([resource, perms]) => {
    // Verifica se existe 'index' e 'show' juntos
    const hasIndex = perms.some((p) => extractActionType(p.slug) === "index");

    // Filtra permissões: se houver 'index', remove 'show'
    const filteredPerms = perms.filter((perm) => {
      const actionType = extractActionType(perm.slug);
      if (hasIndex && actionType === "show") {
        return false; // Remove 'show' se 'index' existir
      }
      return true;
    });

    // Remove duplicatas por tipo de ação
    const seenTypes = new Set<string>();
    const uniquePerms = filteredPerms.filter((perm) => {
      const actionType = extractActionType(perm.slug);
      const actionConfig = ACTION_MAP[actionType];
      const type = actionConfig?.type || "extra";

      if (seenTypes.has(type)) {
        return false;
      }
      seenTypes.add(type);
      return true;
    });

    // Mapeia e ordena as ações
    const actions = uniquePerms
      .map((perm) => {
        const actionType = extractActionType(perm.slug);
        const actionConfig = ACTION_MAP[actionType];

        return {
          id: perm.id!,
          name: perm.name || "Sem nome",
          slug: perm.slug || "",
          type: actionConfig?.type || ("extra" as const),
          order: actionConfig?.order || 999,
        };
      })
      .sort((a, b) => a.order - b.order);

    return {
      resource,
      displayName: normalizeResourceName(resource),
      actions,
    };
  });
}

/**
 * Retorna todos os IDs de permissões de um array
 */
export function getAllPermissionIds(permissions: IPermission[]): string[] {
  return permissions.filter((p) => p.id).map((p) => p.id!);
}

/**
 * Retorna todos os IDs de permissões de um grupo específico
 */
export function getGroupPermissionIds(group: IGroupedPermissions): string[] {
  return group.actions.map((a) => a.id);
}
