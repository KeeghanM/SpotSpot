import { authClient } from '@/lib/auth/client-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Header() {
  const { data: session, isPending } =
    authClient.useSession()

  return (
    <div className="bg-slate-800 px-4 py-12 text-center text-white">
      <h1 className="text-accent text-4xl">SpotSpot</h1>
      <p className="text-2xl">
        {!isPending && session ? (
          `${session.user.name.split(' ')[0]}'s Spots`
        ) : (
          <Skeleton className="h-4 w-[200px]" />
        )}
      </p>
    </div>
  )
}
