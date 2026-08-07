import { getClients } from "../lib/api";
import { ClientDetails } from "../types/Clients/ClientDetails";
import ClientsTable from "../components/Tables/ClientsTable";
import CreateClientAction from "../components/Actions/Clients/CreateClientAction";
import PageContext, { UrlItem } from "../components/PageContext";


export default async function ClientsPage()
{
    var url : UrlItem[] = [
        {label: "Clients", value: "/clients"}
    ]

    var clients: ClientDetails[] = [];
    try{
        clients = await getClients();
    }catch (error) {
        console.error(error);
    }

    return (
        <main className="w-full mx-auto px-4 py-8 space-y-6">

            <PageContext url={url} title="Clients" 
                        description="AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"></PageContext>



            <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Clients List</h2>
                    <CreateClientAction></CreateClientAction>
                </div>

                <ClientsTable clients={clients}></ClientsTable>
            </div>

        </main>
    );
}