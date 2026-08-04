import { getClients } from "../lib/api";
import { ClientDetails } from "../types/ClientDetails";
import ClientsTable from "../components/Tables/ClientsTable";

export default async function ClientsPage()
{
    var clients: ClientDetails[] = [];
    try{
        clients = await getClients();
    }catch (error) {
        console.error(error);
    }

    return (
        <main className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Clients
            </h1>

            <ClientsTable clients={clients}></ClientsTable>

        </main>
    );
}