import {
  useFiltersStore,
  type Tag,
} from '@/components/app/stores/filters'
import { authClient } from '@/lib/auth/client-react'
import CreatableSelect from 'react-select'

interface TagsProps {
  spotTags: Tag[]
  setTags: (tags: Tag[]) => void
}
export default function Tags({
  spotTags,
  setTags,
}: TagsProps) {
  const { tags: availableTags } = useFiltersStore()
  const { data: userData } = authClient.useSession()
  return (
    <CreatableSelect
      options={availableTags.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }))}
      defaultValue={spotTags.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }))}
      onChange={(selectedTags) => {
        const newTags = selectedTags.map((tag) => {
          if (tag.value.toString() === tag.label) {
            return {
              id: -1,
              name: tag.value.toString(),
              userId: userData!.user.id,
            }
          } else {
            return {
              id: tag.value,
              name: tag.label,
              userId: userData!.user.id,
            }
          }
        })
        setTags(newTags)
      }}
      isMulti
    />
  )
}
