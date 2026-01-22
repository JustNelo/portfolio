'use client'

interface ResponsibilitiesInputProps {
  responsibilities: string[]
  inputValue: string
  onInputChange: (value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  langSuffix?: string
  placeholder?: string
}

export default function ResponsibilitiesInput({
  responsibilities,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  langSuffix,
  placeholder = 'Ex: Creative Direction',
}: ResponsibilitiesInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onAdd()
    }
  }

  return (
    <div>
      <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
        Responsabilités {langSuffix && `(${langSuffix})`}
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
        />
        <button
          type="button"
          onClick={onAdd}
          aria-label="Ajouter une responsabilité"
          className="px-5 py-3.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg font-mono text-sm text-primary hover:bg-primary/20 hover:border-primary/30 transition-all duration-200"
        >
          +
        </button>
      </div>
      {responsibilities.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Liste des responsabilités">
          {responsibilities.map((resp, index) => (
            <span
              key={index}
              role="listitem"
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg font-mono text-xs text-white/80"
            >
              {resp}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Supprimer ${resp}`}
                className="text-white/40 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
