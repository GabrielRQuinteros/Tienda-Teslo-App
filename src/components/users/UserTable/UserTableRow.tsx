import { UserResume } from "@/actions/orders/interfaces/interfases";
import {
  userActiveStatusToLabel,
  userRolesToLabel,
} from "@/helpers/casts/casts";
import Link from "next/link";


interface Props {
  userResumed: UserResume;
  // onOpenEditUserModal: (id: string) => void
}

export const UserTableRow = ({
  userResumed: { id, name, email, isActive, roles },
}: Props) => {
  const activeLabel = userActiveStatusToLabel(isActive);
  const rolesLabel = userRolesToLabel(roles).reduce(
    (acum, valActual) => (acum == "" ? valActual : acum + " | " + valActual),
    ""
  );
  return (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
      <td className="font-medium text-gray-900">#{id}</td>
      <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {name}
      </td>
      <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {email}
      </td>
      <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {
          <span
            className={`ml-1 text-sm font-semibold ${
              isActive ? "text-green-700" : "text-red-700"
            }`}
          >
            {activeLabel}
          </span>
        }
      </td>
      <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {rolesLabel}
      </td>
      <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        <Link
          href={`/admin/users/${id}`}
          className="group px-3 py-0.5 bg-gray-900 text-white rounded border border-transparent
               hover:bg-white hover:text-gray-900 hover:border-gray-900 
               transition gap-2 items-center inline-flex"
        >
          {/* <FaPencilAlt className="w-4 h-4 text-white group-hover:text-gray-900 transition" /> */}
          <span className="font-bold">Editar</span>
        </Link>
      </td>
    </tr>
  );
};
