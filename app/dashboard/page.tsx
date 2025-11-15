import { Header } from "@/components/header"
import { UserDashboard } from "@/components/user-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <UserDashboard />
    </div>
  )
}
