import { Button, Input, Link } from "@nextui-org/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default function Login() {
  const signUp = async (formData: FormData) => {
    "use server";
    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surnames = formData.get("surnames") as string;
    const username = formData.get("username") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          name,
          surnames,
          user_name: username,
        },
      },
    });

    if (error) {
      console.log("error :>> ", error);
    } else {
      return redirect("/login?message=successRegister");
    }
  };

  return (
    <main className="flex w-full">
      <Button
        href="/"
        as={Link}
        className="absolute animate-in left-8 top-8"
        startContent={
          <IconChevronLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
        }
      >
        Atrás
      </Button>
      <div className="flex flex-col items-center justify-center w-3/5 h-screen">
        <div className="flex flex-col w-1/2 gap-6">
          <h1 className="text-2xl font-bold">Registrate en Minerva</h1>
          <form
            className="flex flex-col justify-center flex-1 gap-6 animate-in text-foreground"
            action={signUp}
          >
            <Input
              label="Nombre"
              name="name"
              type="text"
              placeholder="ejemplo@minerva.com"
              labelPlacement="outside"
              isRequired
            />
            <Input
              label="Apellidos"
              name="surnames"
              type="text"
              placeholder="ejemplo@minerva.com"
              labelPlacement="outside"
              isRequired
            />
            <Input
              label="Nombre de usuario"
              name="username"
              type="text"
              placeholder="ejemplo@minerva.com"
              labelPlacement="outside"
              isRequired
            />
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
        </div>
      </div>
      <div className="flex w-2/5 h-screen rounded-bl-[30%] bg-primary items-center justify-center">
        <h1 className="text-[200px] font-bold text-white">M</h1>
      </div>
    </main>
  );
}
