'use client'

export default function TeaseCard(): React.JSX.Element {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-8 md:p-12 backdrop-blur-md bg-card border border-border rounded-2xl max-w-lg mx-4 shadow-2xl shadow-black/50">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-accent text-accent-foreground rounded-full">
          Bientôt
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Portfolio
        </h1>
        <p className="text-lg text-secondary max-w-sm leading-relaxed">
          Quelque chose de nouveau se prépare. Restez à l'affût pour une expérience immersive.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-muted font-medium uppercase tracking-wider">En construction</span>
        </div>
      </div>

      <div className="absolute -inset-px bg-linear-to-b from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
    </div>
  )
}
