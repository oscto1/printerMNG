import LoginRegister from "../../components/LoginRegister"
import Navbar from "../../components/Navbar"

export default async function LoginRegisterPage(){

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center px-4">
            <Navbar tabs={false} />
            <div className="my-auto w-full flex justify-center">
                <LoginRegister />
            </div>
        </main>
    )
}