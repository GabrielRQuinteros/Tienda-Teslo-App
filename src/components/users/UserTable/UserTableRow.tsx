import { UserResume } from "@/actions/orders/interfaces/interfases"
import { userActiveStatusToLabel, userRolesToLabel } from "@/helpers/casts/casts"

interface Props {
    userResumed: UserResume
}

export const UserTableRow = ( {userResumed:{ id, name, email, isActive, roles } }: Props ) => {
  const activeLabel = userActiveStatusToLabel( isActive );
  const rolesLabel = userRolesToLabel(roles).reduce( ( acum, valActual) => (acum == ""? valActual: acum + " | " + valActual), "" );
  return (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
        <td className="font-medium text-gray-900">#{id}</td>
        <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">{name}</td>
        <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ email }</td>
        <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ 
          <span className={`ml-1 text-sm font-semibold ${isActive ? "text-green-700" : "text-red-700"}`}>
            {activeLabel}
          </span> }
        </td>
        <td className="text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ rolesLabel }</td>
    </tr>
  )
}
