'use client'

import { Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"

export const GoToAdmin = () => {
    const router = useRouter()
    return <Button variant="bordered" onClick={()=>(router.push('/admin'))}>Adminside</Button>
}