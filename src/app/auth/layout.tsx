import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode;}) {
  return (
    <main className="flex justify-center">
      {/* Side Auth Image */}
      <div className="lg:w-5/8 hidden xl:block">
        <Image src={"/imgs/auth-image.png"}
               width={1920}
               height={1080}
               alt="Tesla Car Login Image"
               className="object-cover w-full h-full" />
      </div>
      <div className="xl:w-3/8 w-full">
      { children }
      </div>
    </main>
  );
}