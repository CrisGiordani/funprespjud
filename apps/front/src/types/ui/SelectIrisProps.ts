import type Option from './Option'

type SelectIrisProps = {
  options: Option[]
  value: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  className?: string
}

export default SelectIrisProps
