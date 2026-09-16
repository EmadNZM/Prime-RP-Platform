"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
export function LogoutButton(){const router=useRouter();return <button className="side-link" style={{width:"100%",border:0,cursor:"pointer"}} onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});router.push("/admin/login")}}><LogOut size={17}/>Logout</button>}
