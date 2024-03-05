import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import SideBar from "@/components/layout/sideBar";
import TopBar from "@/components/layout/topBar";

export const metadata: Metadata = {
  title: "Minerva",
  description: "Minerva",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={"flex items-center w-full h-screen max-h-screen min-h-screen"}
    >
      <SideBar />
      <div className="flex flex-col w-full h-screen max-h-screen min-h-screen overflow-y-auto ">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!rounded-xl"
        />
        <div className="relative flex flex-col justify-center w-full">
          <TopBar />
          <div className="bg-default-100 min-h-[calc(100vh-3.5rem)] pt-5 px-10">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
