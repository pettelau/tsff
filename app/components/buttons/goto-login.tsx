'use client'

import { Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"

export const GoToLogin = () => {
    const router = useRouter()
    return <Button variant="bordered" onClick={()=>(router.push('/auth/login'))}>Logg inn</Button>
}