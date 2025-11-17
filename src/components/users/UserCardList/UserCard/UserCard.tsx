import { UserResume } from "@/actions/orders/interfaces/interfases";
import { userActiveStatusToLabel, userRolesToLabel } from "@/helpers/casts/casts";
import Link from "next/link";
import { IoArrowForward, IoPersonOutline } from "react-icons/io5";

interface Props {
  userResumed: UserResume;
}

export const UserCard = ({ userResumed: { id, name, email, isActive, roles } }: Props) => {
  const activeLabel = userActiveStatusToLabel(isActive);
  const rolesLabel = userRolesToLabel(roles).join(", ");

  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm transition duration-300 hover:shadow-md">
      {/* Encabezado */}
      <div className="flex flex-row justify-between mb-4 mt-2">
        <div className="flex items-center gap-2">
          <IoPersonOutline className="text-gray-700" size={20} />
          <span className="text-sm font-semibold text-gray-800">ID: #{id}</span>
        </div>

        <div className="flex items-center">
          <span
            className={`ml-1 text-sm font-semibold ${
              isActive ? "text-green-700" : "text-red-700"
            }`}
          >
            {activeLabel}
          </span>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm">
          <strong>Nombre:</strong> {name || "Sin nombre"}
        </p>
        <p className="text-gray-700 text-sm">
          <strong>Email:</strong> {email || "Sin correo"}
        </p>
        <p className="text-gray-700 text-sm">
          <strong>Roles:</strong> {rolesLabel || "Sin roles"}
        </p>
      </div>

      {/* Acción */}
      <div className="mt-3 flex flex-row justify-end">
        <Link
          href={`/admin/users/${id}`}
          className="text-gray-500 hover:underline text-[15px] font-semibold flex items-center gap-2"
        >
          Editar <IoArrowForward size={18} />
        </Link>
      </div>
    </div>
  );
};