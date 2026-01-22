import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { anton, jetbrainsMono } from "@/app/fonts"
import "@/app/globals.css"
import Scene from "@/components/Scene"
import AdminSidebar from './_components/AdminSidebar'
import { Toaster } from './_components/Toaster'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <html lang="fr">
      <body className={`${anton.variable} ${jetbrainsMono.variable} antialiased`}>
        <Scene />
        <div className="min-h-screen relative z-10">
          {/* Sidebar - hidden on mobile, visible on lg+ */}
          <AdminSidebar user={user} />
          
          {/* Main content - full width on mobile, offset on lg+ */}
          <main className="min-h-screen lg:ml-72 transition-all duration-300">
            <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
              {children}
            </div>
          </main>
          
          <Toaster />
        </div>
      </body>
    </html>
  )
}
