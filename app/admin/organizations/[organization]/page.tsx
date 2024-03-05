"use client";

import useUser from "@/hooks/useUser";

export default function Page({ params }: { params: { organization: string } }) {
  const User: any = useUser();

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-start justify-center w-full">
        <span className="text-sm font-semibold animate-in">Bienvenido a</span>
        <h1 className="text-3xl font-bold animate-in">
          {User.data?.organization.name}
        </h1>
      </div>
    </div>
  );
}
