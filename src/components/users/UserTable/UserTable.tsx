import { UserResume } from "@/actions/orders/interfaces/interfases"
import { UserTableRow } from "./UserTableRow"

interface Props {
    resumedUserList: UserResume[]
}
export const UserTable = ( { resumedUserList }: Props ) => {

  return (
    <>
      <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                  #ID
                </th>
                <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                  Nombre
                </th>
                <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                  Email
                </th>
                <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                  Estado
                </th>
                <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                  Roles
                </th>
                <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                  Opciones
                </th>
              </tr>
            </thead>
          <tbody>
              { resumedUserList.map( user => ( <UserTableRow key={user.id} userResumed={user} /> ) ) }
          </tbody>
      </table>
    </>
  )
}
