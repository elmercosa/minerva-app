import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

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
    <main className="flex flex-col items-center h-screen max-h-screen p-4 bg-gray-100">
      <TopBar />
      <div className="flex flex-col w-11/12">
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
        <div className="relative flex flex-col justify-center w-full mt-10">
          {children}
        </div>
      </div>
    </main>
  );
}
