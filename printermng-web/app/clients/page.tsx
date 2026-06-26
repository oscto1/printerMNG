import { getClients } from "../lib/api";
import { ClientDetails } from "../types/client";
import Link from "next/link";

export default async function ClientsPage()
{
    const clients: ClientDetails[] = await getClients();

    return (
        <main className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Clients
            </h1>

            <table className="w-full border">

                <thead>
                    <tr className="border-b">
                        <th className="text-center p-2">Document</th>
                        <th className="text-center p-2">Name</th>
                        <th className="text-center p-2">Phone</th>
                        <th className="text-center p-2">Location</th>
                        <th className="text-center p-2">Show more</th>
                    </tr>
                </thead>

                <tbody>

                    {clients.map(client => (

                        <tr
                            key={client.id}
                            className="border-b hover:bg-gray-100"
                        >
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

                            <td>
                                <Link href={`/clients/${client.id}`}>
                                    See client...
                                </Link>
                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </main>
    );
}