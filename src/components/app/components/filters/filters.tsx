import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { authClient } from '@/lib/auth/client-react'
import { usePostHog } from 'posthog-js/react'
import type { GroupBase, StylesConfig } from 'react-select'
import Select from 'react-select'
import { useAppStore } from '../../stores/app'
import { useFiltersStore } from '../../stores/filters'
import { useListsStore } from '../../stores/lists'

interface OptionType {
  value: string
  label: string
}

const selectStyles: StylesConfig<
  OptionType,
  boolean,
  GroupBase<OptionType>
> = {
  control: (base, state) => ({
    ...base,
    'backgroundColor': 'white',
    'borderRadius': '1rem', // .rounded-xl
    'borderColor': state.isFocused
      ? 'var(--color-ring)'
      : 'hsl(330, 25%, 90%)', // border-pink-200 or ring color
    'boxShadow': state.isFocused
      ? `0 0 0 3px hsla(var(--tw-ring-color-hsl), 0.5)`
      : 'none', // ring-purple-200/50
    'padding': '0.25rem 0.5rem',
    'minHeight': '44px', // h-11
    'transition': 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: 'hsl(330, 30%, 80%)', // lighter pink for hover
    },
  }),
  option: (base, state) => ({
    ...base,
    'backgroundColor': state.isSelected
      ? 'var(--color-primary)' // orange-500
      : state.isFocused
        ? 'hsl(330, 40%, 96%)' // pink-50/30
        : 'white',
    'color': state.isSelected
      ? 'white'
      : 'hsl(340, 15%, 25%)', // soft dark gray
    'borderRadius': '0.75rem',
    'margin': '0.25rem',
    'padding': '0.5rem 0.75rem',
    'width': 'auto',
    '&:active': { backgroundColor: 'var(--color-primary)' },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px hsla(330, 40%, 85%, 0.15)',
    padding: '0.5rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'hsl(330, 40%, 92%)', // light pink
    borderRadius: '0.5rem',
    padding: '0.1rem 0.25rem',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--color-secondary)', // purple-600
    fontWeight: '500',
  }),
  multiValueRemove: (base) => ({
    ...base,
    'color': 'var(--color-secondary)',
    '&:hover': {
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'hsl(340, 15%, 50%)', // muted pink-gray
  }),
  input: (base) => ({
    ...base,
    color: 'hsl(340, 15%, 25%)', // soft dark gray
  }),
  singleValue: (base) => ({
    ...base,
    color: 'hsl(340, 15%, 25%)', // soft dark gray
  }),
}

export default function Filters({
  compact = false,
}: {
  compact?: boolean
}) {
  const posthog = usePostHog()
  const { mode } = useAppStore()
  const { lists, selectList, currentList } = useListsStore()
  const {
    tags,
    setSelectedTags,
    showVisited,
    setShowVisited,
    selectedTags,
  } = useFiltersStore()
  const { data: userData } = authClient.useSession()

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
