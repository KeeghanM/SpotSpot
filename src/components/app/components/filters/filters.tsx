import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { authClient } from '@/lib/auth/client-react'
import { usePostHog } from 'posthog-js/react'
import { useAppStore } from '../../stores/app'
import { useFiltersStore } from '../../stores/filters'
import { selectStyles } from './select-styles'
import { useListsQueries } from '../../hooks/useListsQueries'
import Select from 'react-select'

export interface IOptionType {
  value: string | number
  label: string
}

export default function Filters({
  compact = false,
}: {
  compact?: boolean
}) {
  const posthog = usePostHog()
  const { mode, currentList, setCurrentList } =
    useAppStore()
  const {
    tags,
    setSelectedTags,
    showVisited,
    setShowVisited,
    selectedTags,
  } = useFiltersStore()
  const { data: userData } = authClient.useSession()
  const { listsQuery } = useListsQueries()

  const trackFilter = () =>
    posthog?.capture('filters_applied', {
      mode,
      list: currentList ? currentList.name : 'none',
      tags: selectedTags.map((tag) => tag.name).join(', '),
      showVisited,
    })

  return (
    <div
      className={
        compact
          ? 'bg-white'
          : 'from-pink-25 to-pink-25 border-b border-pink-100 bg-gradient-to-r via-white shadow-sm'
      }
    >
      <div
        className={
          compact
            ? 'flex flex-col gap-4 p-0'
            : 'mx-auto flex w-lg max-w-full flex-row items-center justify-center gap-4 p-4'
        }
      >
        {mode === 'map' && (
          <Select
            menuPlacement="top"
            defaultValue={
              currentList
                ? {
                    label: currentList.name,
                    value: currentList.id,
                  }
                : undefined
            }
            options={listsQuery.data?.map((list) => ({
              label: list.name,
              value: list.id,
            }))}
            isMulti={false}
            onChange={(selectedList) => {
              if (!selectedList) return

              const list = listsQuery.data?.find(
                (list) =>
                  list.id === Number(selectedList.value),
              )
              if (list) {
                setCurrentList(list)
              }
            }}
            placeholder="Select a list"
            className="w-full md:w-1/2"
            styles={selectStyles}
          />
        )}
        <Select
          menuPlacement="top"
          options={tags.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }))}
          onChange={(selectedTags) => {
            trackFilter()
            const newTags = selectedTags.map((tag) => {
              return {
                id: Number(tag.value),
                name: tag.label,
                userId: userData!.user.id,
              }
            })
            setSelectedTags(newTags)
          }}
          isMulti
          placeholder="Filter by tags"
          className="w-full md:w-1/2"
          styles={selectStyles}
        />
        <div
          className={
            compact
              ? 'flex flex-col items-center justify-center gap-1 rounded-xl border border-pink-200 bg-pink-50 p-2'
              : 'flex flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-pink-200 bg-pink-50 p-2.5'
          }
        >
          <Label
            className={
              compact
                ? 'min-w-[10ch] text-xs font-medium text-pink-700'
                : 'min-w-[10ch] justify-center text-center text-xs font-medium text-pink-700'
            }
            htmlFor="showVisited"
          >
            Show Visited
          </Label>
          <div>
            <Switch
              id="showVisited"
              checked={showVisited}
              onCheckedChange={(checked) => {
                trackFilter()
                setShowVisited(checked)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
