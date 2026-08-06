import { getClients } from "../lib/api";
import { ClientDetails } from "../types/Clients/ClientDetails";
import ClientsTable from "../components/Tables/ClientsTable";
import CreateClientAction from "../components/Actions/Clients/CreateClientAction";

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

            <CreateClientAction></CreateClientAction>
            <ClientsTable clients={clients}></ClientsTable>

        </main>
    );
}