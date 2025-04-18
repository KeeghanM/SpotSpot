import Select from 'react-select'
import { useFiltersStore } from '../../stores/filters'
import { authClient } from '@/lib/auth/client-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAppStore } from '../../stores/app'
import { useListsStore } from '../../stores/lists'

export default function Filters() {
  const { mode } = useAppStore()
  const { lists, selectList, currentList } = useListsStore()
  const {
    tags,
    setSelectedTags,
    showVisited,
    setShowVisited,
  } = useFiltersStore()
  const { data: userData } = authClient.useSession()

  return (
    <div className="bg-accent/20 shadow">
      <div className="mx-auto flex w-lg max-w-full flex-row items-center justify-center gap-2 p-4">
        {mode === 'map' && (
          <Select
            defaultValue={
              currentList
                ? {
                    label: currentList.name,
                    value: currentList.id,
                  }
                : undefined
            }
            options={lists.map((list) => ({
              label: list.name,
              value: list.id,
            }))}
            onChange={(selectedList) => {
              if (!selectedList) return
              const list = lists.find(
                (list) => list.id === selectedList.value,
              )
              if (list) {
                selectList(list)
              }
            }}
            placeholder="Select a list"
            className="w-full md:w-1/2"
          />
        )}
        <Select
          options={tags.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }))}
          onChange={(selectedTags) => {
            const newTags = selectedTags.map((tag) => {
              return {
                id: tag.value,
                name: tag.label,
                userId: userData!.user.id,
              }
            })
            setSelectedTags(newTags)
          }}
          isMulti
          placeholder="Filter by tags"
          className="w-full md:w-1/2"
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <Label
            className="min-w-[12ch] justify-center text-center"
            htmlFor="showVisited"
          >
            Show Visited
          </Label>
          <div>
            <Switch
              id="showVisited"
              checked={showVisited}
              onCheckedChange={(checked) => {
                setShowVisited(checked)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
