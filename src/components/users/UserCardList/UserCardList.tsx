import { UserResume } from "@/actions/orders/interfaces/interfases"
import { UserCard } from "./UserCard/UserCard"

interface Props {
  resumedUsersList: UserResume[]
}

export const UserCardList = ({ resumedUsersList }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {resumedUsersList.map(user => (
        <UserCard key={user.id} userResumed={user} />
      ))}
    </div>
  )
}