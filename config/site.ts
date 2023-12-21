export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Storage Plus",
  logo: "/favicon.ico",
  description: "Sistema de control interno de Plus.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Horario",
      href: "/horario",
    },
    {
      label: "Inventario",
      href: "/inventario",
    },
    {
      label: "Personal",
      href: "/personal",
    },
  ],
};
