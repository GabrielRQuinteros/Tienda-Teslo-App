"use client";

import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { SideMenu } from "./side-menu/SideMenu";
import { useUIStore } from "@/components/store/store";
import clsx from "clsx";

export const SideBar = () => {
  const { openSideMenu, closeSideMenu, isSideMenuOpen } = useUIStore( (state) => state);

  const onCloseSideBar = () => {
    closeSideMenu();
  };
  return (
    <div>
      {isSideMenuOpen && (
        <>
          {/* Black Background */}
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
          {/* Blur */}
          <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-[2px]"></div>
        </>
      )}

      {/* Side Menu */}
      {/* TODO: Efecto de Slide */}
      <nav
        className={
            clsx(
          "fixed p-5 right-0 top-0 w-full sm:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
            "translate-x-0": isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => onCloseSideBar()}
        />
        {/* Input */}
        <div className="mt-14 relative">
          <IoSearchOutline size={20} className="top-2 left-2 absolute" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded px-10 py-1 border-b-2 text-lg border-gray-200 focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* SideMenú */}
        <SideMenu />
      </nav>
    </div>
  );
};
