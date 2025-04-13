import { useAppStore } from '../../stores/app'
import { Button } from '@/components/ui/button'

export default function MapViewToggle() {
  const { mode, setMode } = useAppStore()

  return (
    <div className="fixed bottom-0 mb-2 flex w-full justify-center">
      <Button
        className="w-xs max-w-screen rounded-full"
        onClick={() => {
          setMode(mode === 'list' ? 'map' : 'list')
        }}
      >
        {mode === 'list' ? 'Map View' : 'List View'}
      </Button>
    </div>
  )
}
