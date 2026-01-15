export default function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
      <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
      {title}
    </h2>
  )
}
