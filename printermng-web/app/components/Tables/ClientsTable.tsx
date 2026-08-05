"use client"
import { useRouter } from "next/navigation"
import { ClientDetails } from "@/app/types/Clients/ClientDetails";
import React from "react";

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

                        <React.Fragment key={client.id}>
                            <tr key={client.id} className="hover:scale-101 cursor-pointer shadow-md shadow-gray-300" onClick={() => {router.push(`clients/${client.id}`)}}>
                                <td className="p-2 rounded-l-lg text-center">
                                    {client.document}
                                </td>
                                <td className="p-2 text-center">
                                    {client.name}
                                </td>

                                <td className="p-2 text-center">
                                    {client.phone}
                                </td>

                                <td className="p-2 rounded-r-lg text-center">
                                    {client.location}
                                </td>
                            </tr>

                            <tr className="h-3  !bg-transparent rowSpacer">
                                <td className="!p-0" colSpan={8}></td>
                            </tr>
                        </React.Fragment>
                    ))}

                </tbody>

            </table>
    )
}