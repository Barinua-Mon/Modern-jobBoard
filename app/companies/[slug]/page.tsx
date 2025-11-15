import { Header } from "@/components/header"
import { CompanyProfile } from "@/components/company-profile"

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div className="min-h-screen">
      <Header />
      <CompanyProfile companySlug={slug} />
    </div>
  )
}
