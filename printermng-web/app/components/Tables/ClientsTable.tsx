"use client"
import { useRouter } from "next/navigation"
import { ClientDetails } from "@/app/types/ClientDetails";

export default function ClientsTable({clients}: {clients: ClientDetails[]}){

    const router = useRouter();

    return(
        <table className="w-full border">

                <thead>
                    <tr className="border-b">
                        <th className="text-center p-2">Document</th>
                        <th className="text-center p-2">Name</th>
                        <th className="text-center p-2">Phone</th>
                        <th className="text-center p-2">Location</th>
                    </tr>
                </thead>

                <tbody>

                    {clients.map(client => (

                        // <Link href={`/clients/${client.id}`}>
                            <tr key={client.id} className="hover:scale-101 cursor-pointer" onClick={() => {router.push(`clients/${client.id}`)}}>
                                <td className="p-2">
                                    {client.document}
                                </td>
                                <td className="p-2">
                                    {client.name}
                                </td>

                                <td className="p-2">
                                    {client.phone}
                                </td>

                                <td className="p-2">
                                    {client.location}
                                </td>
                            </tr>
                        // </Link>

                    ))}

                </tbody>

            </table>
    )
}