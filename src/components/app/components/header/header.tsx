import { authClient } from '@/lib/auth/client-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { data: session, isPending } =
    authClient.useSession()

  return (
    <div className="relative bg-slate-800 px-4 py-12 text-center text-white">
      <h1 className="text-accent text-4xl">SpotSpot</h1>
      {!isPending && session ? (
        <p className="text-2xl">
          {session.user.name.split(' ')[0]}'s Spots
        </p>
      ) : null}
      <Button
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600"
        onClick={() => {
          authClient.signOut()
          window.location.assign('/')
        }}
      >
        Sign Out
      </Button>
    </div>
  )
}
