import NewList from './new-list'
import NewSpot from './new-spot'

export default function Controls() {
  return (
    <div className="bg-slate-800 p-4">
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
        <NewList />
        <NewSpot />
      </div>
    </div>
  )
}
