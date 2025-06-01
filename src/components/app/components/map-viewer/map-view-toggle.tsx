import { Button } from '@/components/ui/button'
import { useAppStore } from '../../stores/app'

export default function MapViewToggle() {
  const { mode, setMode } = useAppStore()

  return (
    <div className="fixed right-6 bottom-6 mb-2 flex justify-center">
      <Button
        className="transform rounded-full bg-gradient-to-r from-purple-400 to-pink-400 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-purple-500 hover:to-pink-500 hover:shadow-xl"
        onClick={() => {
          setMode(mode === 'list' ? 'map' : 'list')
        }}
      >
        {mode === 'list' ? '🗺️ Map View' : '📋 List View'}
      </Button>
    </div>
  )
}
