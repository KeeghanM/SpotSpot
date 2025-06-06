import type { GroupBase, StylesConfig } from 'react-select'
import type { OptionType } from './filters'

export const selectStyles: StylesConfig<
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
