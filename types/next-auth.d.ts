import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    phoneNumber: string
    isVerified: boolean
    role: string
    accessToken: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      phoneNumber: string
      isVerified: boolean
      role: string
      accessToken: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    phoneNumber: string
    isVerified: boolean
    role: string
    accessToken: string
  }
}
