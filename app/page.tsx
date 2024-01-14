"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";

import useUser from "@/hooks/useUser";

export default function Index() {
  const User = useUser();
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <h2 className="text-6xl font-bold animate-in">Bienvenido a Minerva</h2>
      <div className="flex items-center justify-center gap-4">
        <Button
          href="/register"
          as={Link}
          color="secondary"
          className="animate-in"
        >
          Registrarse
        </Button>
        <Button href="/login" as={Link} color="primary" className="animate-in">
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
}
