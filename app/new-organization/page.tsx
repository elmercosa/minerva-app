import { Button, Input } from "@nextui-org/react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: organization, error } = await supabase
    .from("organizations")
    .select()
    .eq("owner_id", user?.id)
    .single();

  if (organization) {
    redirect(`/admin/organizations/${organization.slug}`);
  }

  const signUp = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const owner_id = formData.get("owner_id") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("organizations")
      .insert([{ email, name, owner_id }])
      .select();

    if (error) {
      console.log("error :>> ", error);
    } else {
      console.log("bieeeeeen :>> ");
      toast.success("Organización creada correctamente");
    }
  };

  return (
    <main className="flex w-full">
      <div className="flex flex-col items-center justify-center w-3/5 h-screen">
        <div className="flex flex-col w-1/2 gap-6">
          <h1 className="text-2xl font-bold">Crea tu organización</h1>
          <form
            className="flex flex-col justify-center flex-1 gap-6 animate-in text-foreground"
            action={signUp}
          >
            <input type="hidden" name="owner_id" value={user?.id} />
            <Input
              label="Nombre"
              name="name"
              type="text"
              placeholder="Minerva"
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
