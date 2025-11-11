export type PrimaryColorConfig = {
  name?: string
  light?: string
  medium?: string
  main: string
  dark?: string
  gray?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    light: '#98BBDF',
    main: '#0578BE',
    medium: '#0E509A',
    dark: '#0F2137',
    gray: '#E6E6E6'
  },
  {
    name: 'primary-2',
    light: '##FBBA00',
    main: '#F7A833',
    medium: '#F39200',
    dark: '#C67815'
  },
  {
    name: 'primary-4',
    light: '#49CCB5',
    main: '#06B999',
    dark: '#048770'
  },
  {
    name: 'primary-5',
    light: '#FFA95A',
    main: '#FF891D',
    dark: '#BA6415'
  },
  {
    name: 'tertiary',
    main: '#F2F2F2'
  }
]

export default primaryColorConfig
