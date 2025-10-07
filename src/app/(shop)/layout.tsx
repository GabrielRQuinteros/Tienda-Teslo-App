import { SideBar, TopMenu } from "@/components";
import { Footer } from "@/components/ui/footer/Footer";

export default function ShopLayout({ children }: { children: React.ReactNode;}) {
  return (
    <>
    <main className="min-h-[calc(100vh-100px)]" >
      <TopMenu/>
      <SideBar/>
      <div className="md:px-10 px-4">
        { children }
      </div>
    </main>
    <Footer/>
    </>

  );
}