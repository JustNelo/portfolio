export default function AboutContent() {
  const squares = Array.from({ length: 3 }, (_, i) => i)
  
  return (
    <div className="flex flex-col gap-16">
      {squares.map((i) => (
        <div 
          key={i}
          className="w-full aspect-square bg-white"
        />
      ))}
    </div>
  )
}
