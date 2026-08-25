import LoginRegister from "../../components/LoginRegister"
import Navbar from "../../components/Navbar"

export default async function LoginRegisterPage(){

    return (
        <main className="min-h-screen bg-gray-100 flex items-center flex-col justify-center px-4 gap-20">
            <Navbar tabs={false}></Navbar>
            <LoginRegister></LoginRegister>
        </main>
    )
}