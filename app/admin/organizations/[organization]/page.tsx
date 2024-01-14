"use client";

import useUser from "@/hooks/useUser";

export default function Page({ params }: { params: { organization: string } }) {
  const User: any = useUser();

  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <span className="text-xl font-bold animate-in">Bienvenido a</span>
        <h1 className="text-6xl font-bold animate-in">
          {User.data?.organization.name}
        </h1>
      </div>
    </div>
  );
}
