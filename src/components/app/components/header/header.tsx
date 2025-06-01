import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth/client-react'

export default function Header() {
  const { data: session, isPending } =
    authClient.useSession()

  return (
    <div className="flex items-center justify-between border-b border-pink-100 bg-gradient-to-r from-white via-pink-50 to-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-2xl font-semibold text-transparent">
          SpotSpot ✨
        </h1>
        {isPending ? (
          <Skeleton className="h-4 w-32 bg-pink-100" />
        ) : (
          <span className="text-sm font-medium text-pink-600">
            {session?.user.name.split(' ')[0]}'s Places 💖
          </span>
        )}
      </div>
      {isPending ? (
        <Skeleton className="h-8 w-16 bg-pink-100" />
      ) : (
        <Button
          size="sm"
          className="rounded-full bg-gradient-to-r from-pink-400 to-pink-500 px-3 py-1 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-500 hover:to-pink-600 hover:shadow-lg"
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
