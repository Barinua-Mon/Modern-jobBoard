"use client"

export function FeaturedCompanies() {
  const companies = [
    { name: "TechCorp", logo: "🚀" },
    { name: "DataFlow", logo: "💾" },
    { name: "CloudNine", logo: "☁️" },
    { name: "CodeLabs", logo: "⚡" },
    { name: "DevHub", logo: "🔧" },
    { name: "ByteWorks", logo: "💻" },
  ]

  return (
    <section className="py-12 border-b border-border/40">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-sm font-semibold text-muted-foreground mb-8">TRUSTED BY LEADING COMPANIES</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl">{company.logo}</div>
              <span className="text-xs font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
