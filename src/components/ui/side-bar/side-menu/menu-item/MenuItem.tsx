'use client';
import { useUIStore } from "@/components/store/store";
import Link from "next/link";

interface Props {
    label: string,
    icon?: React.ReactNode,
    href: string
}

export const MenuItem = ({ label, icon, href }: Props) => {
  
  const { closeSideMenu } = useUIStore( (state) => state);

  const closeSideBar = (event: React.MouseEvent) => {
    closeSideMenu();
  }

  return (
    <Link
      href={href}
      className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      onClick={closeSideBar}
    >
      {icon}
      <span className="ml-3 text-xl">{label}</span>
    </Link>
  );
};
