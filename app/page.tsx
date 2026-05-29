"use client"
import MainContent from "./Components/MainContent/MainContent";
import SideBar from "./Components/SideBar/SideBar";


export default function Home() {
  return (
    <>
      <header className="bg-cyan-800 shadow-xl z-20 p-4">
        <h2 className="text-4xl">FilesView</h2>
      </header>
      <main className="grid grid-cols-12 h-screen">
        <SideBar />
        <div className="col-span-9 bg-gray-800 p-6 overflow-auto">
         <MainContent/>
        </div>
      </main>
    </>
  );
}
