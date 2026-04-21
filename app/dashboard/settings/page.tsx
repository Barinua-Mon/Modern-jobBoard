import { Header } from "@/components/header"
import { SettingsPage } from "@/components/settings-page"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  if(!user)  redirect("/signin")

  return(
  <div className="min-h-screen">
    <Header />
    <SettingsPage user={user} />
  </div>
  )
}