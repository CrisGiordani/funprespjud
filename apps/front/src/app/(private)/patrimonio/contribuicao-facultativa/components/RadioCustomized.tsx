type RadioCustomizedProps = {
  option: { id: string; label: string }
  selectedOption: string
  setSelectedOption: (value: string) => void
  icon: string
}

export function RadioCustomized({ option, selectedOption, setSelectedOption, icon }: RadioCustomizedProps) {
  return (
    <div key={option.id} className='relative flex-1'>
      {/* Radio input escondido */}
      <input
        type='radio'
        id={option.id}
        name='radio-group'
        value={option.id}
        checked={selectedOption === option.id}
        onChange={() => setSelectedOption(option.id)}
        className='sr-only' // Esconde o input mas mantém acessível
      />

      {/* Div clicável */}
      <label
        htmlFor={option.id}
        className={`
              block w-full p-6 border-2 rounded-lg cursor-pointer transition-all
              ${
                selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
              }
        `}
      >
        <div className='flex flex-col items-center gap-2'>
          <i className={`${icon} text-primary-main text-4xl`}></i>
          <span>{option.label}</span>
        </div>
      </label>
    </div>
  )
}
