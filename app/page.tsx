// "use client";
import { Link } from "@nextui-org/react";
import { Snippet } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Usuario } from "@/lib/definitions";

import { Spinner } from "@nextui-org/react";

import { auth } from "@/auth"

import { redirect } from 'next/navigation';

export default async function Home() {
  // Redirect to Usuarios

  redirect("/personal");

  return (
    <div>
      <h1 className="text-7xl">Bienvenido</h1>
    </div>
  );
}
