import { useContext } from "react";
import { RoleContext } from "../context/RoleProvider";

export const useGetRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useGetRole must be used inside RoleProvider");
  return context;
};