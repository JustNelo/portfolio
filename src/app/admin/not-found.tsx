import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-6xl text-primary mb-4">404</h1>
        <h2 className="font-heading text-xl text-white mb-4">
          Page non trouvée
        </h2>
        <p className="font-mono text-sm text-white/60 mb-8">
          La page que vous recherchez n&apos;existe pas dans l&apos;administration.
        </p>
        
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-primary/80 text-background font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Retour au Dashboard
        </Link>
      </div>
    </div>
  )
}
