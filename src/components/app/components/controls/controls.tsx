import NewList from './new-list'
import NewSpot from './new-spot'

export default function Controls() {
  return (
    <div className="flex items-center justify-center gap-2 bg-slate-800 px-4 pb-4">
      <NewList />
      <NewSpot />
    </div>
  )
}
