export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-white/10 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  )
}
