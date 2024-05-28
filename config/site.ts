export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Storage Plus",
  logo: "/favicon.ico",
  description: "Sistema de control interno de Plus.",
  navItems: [
    {
      label: "Horario",
      href: "/horario",
    },
    {
      label: "Productos",
      href: "/productos",
    },
    {
      label: "Proveedores",
      href: "/proveedores",
    },
    {
      label: "Personal",
      href: "/personal",
    },
  ],
};
