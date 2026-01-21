import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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
    <div className="min-h-screen flex backdrop-blur-xl">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
