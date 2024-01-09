"use client";

import { Button, Input } from "@nextui-org/react";

export default function LoginForm({ signIn }: { signIn: any }) {
  return (
    <form
      className="flex flex-col justify-center flex-1 gap-6 animate-in text-foreground"
      action={signIn}
    >
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="ejemplo@minerva.com"
        labelPlacement="outside"
        isRequired
      />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="*******"
        labelPlacement="outside"
        isRequired
      />
      <Button
        color="primary"
        className="font-semibold text-white"
        type="submit"
      >
        Acceder
      </Button>
    </form>
  );
}
