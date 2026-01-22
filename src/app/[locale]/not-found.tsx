import { Link } from '@/lib/i18n/navigation'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-heading text-6xl sm:text-8xl text-primary mb-4">404</h1>
        <p className="font-mono text-sm text-muted mb-8">Page non trouvée</p>
        <Link 
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-primary text-background font-mono text-sm uppercase tracking-widest hover:opacity-80 transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
