import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";
export default function LoginPage(){return <main className="login-wrap"><section className="login-card"><Image src="/prime-rp-logo.png" alt="Prime RP" width={95} height={65}/><h1>Prime RP</h1><p>Admin Control Center</p><LoginForm/></section></main>}
