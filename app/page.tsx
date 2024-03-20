import { Button, Input, Link } from "@nextui-org/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
    } else {
      return redirect("/organizations");
    }
  };

  return (
    <main className="flex w-full">
      <div className="flex flex-col items-center justify-center w-3/5 h-screen">
        <div className="flex flex-col w-1/2 gap-6">
          <h1 className="text-2xl font-bold">Bienvenido a Minerva</h1>
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
            {searchParams?.message && (
              <p className="p-2 mt-2 text-center bg-foreground/10 rounded-xl">
                {searchParams.message}
              </p>
            )}
          </form>
        </div>
      </div>
      <div className="flex w-2/5 h-screen rounded-bl-[30%] bg-primary items-center justify-center">
        <h1 className="text-[200px] font-bold text-white">M</h1>
      </div>
    </main>
  );
}
