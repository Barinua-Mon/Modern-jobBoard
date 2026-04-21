import { Role } from "@/lib/generated/prisma"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role
  }
}