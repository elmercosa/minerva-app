"use client";
import { Button, Link } from "@nextui-org/react";
import { IconDiamond, IconPlus } from "@tabler/icons-react";

import useQuery from "@/hooks/useQuery";

export default function Page() {
  const { data, error, loading } = useQuery("organizations", "*");

  return (
    <main className="flex items-center justify-center w-full h-screen max-h-screen py-10">
      <div className="relative flex flex-col w-8/12 h-full gap-10">
        <div className="flex items-baseline justify-between w-full gap-2">
          <div className="flex items-baseline gap-2 animate-in">
            <IconDiamond size={48} className="text-primary" />
            <h2 className="text-5xl font-bold">Minerva</h2>
          </div>
          <h2 className="text-2xl font-semibold animate-in">Organizaciones</h2>
        </div>
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-4 gap-4">
            {data.map((organization: any) => (
              <Link
                href={`/organizations/${organization.slug}`}
                key={organization.id}
                className="flex items-center justify-center p-4 font-semibold transition-all duration-300 ease-in-out h-28 bg-default-100 rounded-xl text-default-800 hover:text-white hover:bg-primary hover:scale-105 hover:text-xl animate-in"
              >
                {organization.name}
              </Link>
            ))}
            <Link
              href={`/organizations/new`}
              key="new organization"
              className="flex items-center justify-center p-4 text-4xl font-semibold transition-all duration-300 ease-in-out h-28 bg-default-100 rounded-xl text-default-800 hover:text-white hover:bg-primary hover:scale-105 hover:text-3xl animate-in"
            >
              +
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
