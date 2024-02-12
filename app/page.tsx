// "use client";

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

import { auth } from "../auth";

export default async function Home() {
  const { user } = await auth();

  return (
    <div>
      <h1 className="text-7xl">Bienvenido {user.Nombre}</h1>
    </div>
  );
}
