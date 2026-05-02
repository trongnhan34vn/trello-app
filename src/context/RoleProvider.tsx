import { createContext, useMemo } from 'react';
import { useListRoleQuery } from '../services/role.service';
import type { Role } from '../types/role.type';

type RoleContextType = {
  roles: Role[];
  options: { label: string; value: string }[];
};

export const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: roleApiRes } = useListRoleQuery();
  const roles = roleApiRes ? roleApiRes.data : [];
  const roleOptions = useMemo(() => roles.map((r) => ({ label: r.name, value: r.id })), [roles]);

  return (
    <RoleContext.Provider value={{ roles, options: roleOptions }}>{children}</RoleContext.Provider>
  );
};
