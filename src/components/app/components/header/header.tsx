import { authClient } from '@/lib/auth/client-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Header() {
  const { data: session, isPending } =
    authClient.useSession()

  return (
    <div className="bg-slate-800 px-4 py-12 text-white">
      <h1>
        SpotSpot -{' '}
        {!isPending && session ? (
          `${session.user.name}'s Spots`
        ) : (
          <Skeleton className="h-4 w-[200px]" />
        )}
      </h1>
    </div>
  )
}
