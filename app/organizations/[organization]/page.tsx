import { Button, Link, ScrollShadow } from "@nextui-org/react";
import { IconDiamond, IconPlus } from "@tabler/icons-react";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export default async function Page({
  params,
}: {
  params: { organization: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("*, projects(*), users!organizations_users(*)")
    .eq("slug", params.organization)
    .single();

  return (
    <main className="flex items-center justify-center w-full h-screen max-h-screen py-10">
      <div className="relative grid w-8/12 h-full grid-cols-6 grid-rows-6 gap-10">
        <div className="flex items-start justify-between w-full col-start-1 col-end-5 row-start-1 row-end-5 gap-2">
          <div className="flex items-center gap-2 animate-in">
            <IconDiamond size={48} className="text-primary" />
            <h2 className="text-5xl font-bold">{organization?.name}</h2>
          </div>
        </div>
        <div className="flex flex-col w-full col-start-5 col-end-7 row-start-1 row-end-7 gap-4">
          <Link
            target="_blank"
            href={`/organizations/${params.organization}/members`}
            className="text-2xl font-semibold underline transition-all text-default-900 underline-offset-2 animate-in decoration-primary hover:text-primary w-fit"
          >
            Miembros
          </Link>
          <ScrollShadow className="flex flex-col h-full max-h-full gap-4 overflow-y-auto">
            {organization?.users?.map((user: any) => (
              <Link
                href={`/organizations/${params.organization}/projects/${user.id}`}
                key={user.id}
                className="flex flex-col items-start justify-center flex-grow-0 flex-shrink-0 p-3 text-sm transition-all duration-300 ease-in-out bg-default-100 rounded-xl text-default-800 hover:text-white hover:bg-primary hover:scale-105 animate-in group"
              >
                <span className="font-semibold ">
                  {user.name} {user.surnames}
                </span>
                <span className="text-xs font-semibold text-default-500 group-hover:text-default-800">
                  @{user.user_name}
                </span>
              </Link>
            ))}
          </ScrollShadow>
        </div>
        <div className="flex flex-col w-full col-start-1 col-end-5 row-start-5 row-end-7 gap-4">
          <h2 className="text-2xl font-semibold underline underline-offset-2 animate-in decoration-primary">
            Proyectos
          </h2>
          <ScrollShadow className="flex flex-col h-full max-h-full gap-4 overflow-y-auto">
            {organization?.projects?.map((project: any) => (
              <Link
                href={`/organizations/${params.organization}/projects/${project.code}`}
                key={project.id}
                className="flex items-center justify-center p-4 font-semibold transition-all duration-300 ease-in-out bg-default-100 rounded-xl text-default-800 hover:text-white hover:bg-primary hover:scale-105 hover:text-xl animate-in"
              >
                {project.name}
              </Link>
            ))}
          </ScrollShadow>
        </div>
      </div>
    </main>
  );
}
