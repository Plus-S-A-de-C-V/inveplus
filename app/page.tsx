"use server";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Usuario } from "@/lib/definitions";

export default async function Home() {
  return (
    <div>
      <h1 className="text-7xl">Bienvenido</h1>
    </div>
  );
}
