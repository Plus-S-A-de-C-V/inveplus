"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useSession } from "next-auth/react";
import { Usuario } from "@/lib/definitions";

import { Spinner } from "@nextui-org/react";

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // TODO: Redirect to login
    },
  });

  if (status === "loading") {
    // Show a spinner in the middle
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" label="Cargando..." labelColor="primary" />
      </div>
    );
  }

  const user = session?.user as Usuario;

  return (
    <div>
      <h1 className="text-7xl">Bienvenido {user.Nombre}</h1>
    </div>
  );
}
