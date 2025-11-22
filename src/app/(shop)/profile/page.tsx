import { authConfig } from "@/auth.config";
import { Title } from "@/components";
import { ProductImage } from "@/components/product/product-image/ProductImage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

  const session = await getServerSession(authConfig);

  if (!session?.user) redirect("/auth/login");

  const { name, email, image, roles, isActive, id } = session.user;

  return (
    <div>
      <Title title="Perfil" />

      <div className="bg-white px-6 py-10 rounded-2xl shadow-lg border border-gray-300 mt-6">

        {/* Header dividido en dos columnas iguales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          {/* Columna izquierda: Foto + datos */}
          <div className="flex items-center gap-6">

            <ProductImage
              src={image || undefined}
              width={500}
              height={500}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="text-neutral-500">{email}</p>
                <div className="flex gap-1">
                    <p
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                        {isActive ? "Activo" : "Inactivo"}
                    </p>
                    {roles?.map((role: string) => (
                        <span
                        key={role}
                        className="px-3.5 py-1 mt-1 inline-block bg-gray-800 text-white rounded-full text-sm font-medium"
                        >
                        {role}
                        </span>
                    ))}
                </div>
            </div>
          </div>

          {/* Columna derecha: ID del usuario */}
          <div className="p-4 rounded-xl h-full">
            <h3 className="font-bold text-neutral-700">ID de usuario</h3>
            <p className="text-neutral-500 break-all">{id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
