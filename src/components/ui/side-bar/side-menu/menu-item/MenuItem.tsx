'use client';
import { useUIStore } from "@/components/store/UIStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    label: string,
    icon?: React.ReactNode,
    href: string,
    aditionalAction?: () => Promise<void>
}

export const MenuItem = ({ label, icon, href, aditionalAction }: Props) => {
  
  const { closeSideMenu } = useUIStore();
  const router = useRouter();

  const handleClick = async (event: React.MouseEvent) => {
    if (aditionalAction) {
      event.preventDefault(); 
      closeSideMenu();
      await aditionalAction();

      if (href)
        router.push(href);
    } else {
      closeSideMenu();
    }
  };

  return (
    <Link
      href={href}
      className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      onClick={handleClick}
    >
      {icon}
      <span className="ml-3 text-xl">{label}</span>
    </Link>
  );
};
