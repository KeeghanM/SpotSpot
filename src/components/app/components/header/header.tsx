import { authClient } from '@/lib/auth/client-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function Header() {
  const { data: session, isPending } =
    authClient.useSession()

  return (
    <div className="relative bg-slate-800 px-4 py-6 text-center text-white">
      <h1 className="text-accent text-4xl">SpotSpot</h1>
      {isPending ? (
        <Skeleton className="mx-auto mt-2 h-6 w-1/2" />
      ) : (
        <p className="mt-2 text-2xl">
          {session?.user.name.split(' ')[0]}'s Spots
        </p>
      )}
      {isPending ? (
        <Skeleton className="absolute top-4 right-4 h-9 w-12" />
      ) : (
        <Button
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600"
          onClick={() => {
            authClient.signOut()
            window.location.assign('/')
          }}
        >
          Sign Out
        </Button>
      )}
    </div>
  )
}
