'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Vue d\'ensemble',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Projets',
    href: '/admin/projects',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: 'Médias',
    href: '/admin/medias',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Paramètres',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

interface AdminSidebarProps {
  user: User
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">
          <Link href="/admin" className="block">
            <h1 className="font-heading text-lg text-primary uppercase tracking-tight">
              Admin
            </h1>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-primary hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar + Mobile Slide-out Menu */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72
          bg-black/40 backdrop-blur-xl border-r border-white/10
          flex flex-col
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo - hidden on mobile (shown in header instead) */}
        <div className="p-6 border-b border-white/10 hidden lg:block">
          <Link href="/admin" className="block group">
            <h1 className="font-heading text-xl text-primary uppercase tracking-tight group-hover:text-primary/80 transition-colors">
              Admin
            </h1>
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest mt-1">
              Portfolio CMS
            </p>
          </Link>
        </div>

        {/* Mobile spacer for header */}
        <div className="h-14 lg:hidden" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-lg font-mono text-xs uppercase tracking-widest
                transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-white/60 hover:text-primary hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <span className={isActive(item.href) ? 'text-primary' : 'text-white/40'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="font-mono text-sm text-primary uppercase">
                {user.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-white/80 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full mt-3 px-4 py-2.5 rounded-lg font-mono text-[10px] text-white/50 uppercase tracking-widest hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-2 bg-black/60 backdrop-blur-xl border-t border-white/10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive(item.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-white/50 hover:text-primary'
                }
              `}
            >
              {item.icon}
              <span className="font-mono text-[8px] uppercase tracking-wider">
                {item.label.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile header */}
      <div className="h-14 lg:hidden" />
    </>
  )
}
