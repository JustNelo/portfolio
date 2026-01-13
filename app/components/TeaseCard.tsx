'use client'

export default function TeaseCard(): React.JSX.Element {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-8 md:p-12 backdrop-blur-sm bg-black/30 border border-cyan-500/20 rounded-2xl max-w-lg mx-4 shadow-2xl shadow-cyan-500/10">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/30">
          Bientôt
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight">
          Portfolio
        </h1>
        <p className="text-lg text-zinc-400 font-sans max-w-sm leading-relaxed">
          Quelque chose de nouveau se prépare. Restez à l'affût pour une expérience immersive.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-sm text-zinc-500 font-medium">En construction</span>
        </div>
      </div>

      <div className="absolute -inset-px bg-linear-to-b from-cyan-500/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
    </div>
  )
}
