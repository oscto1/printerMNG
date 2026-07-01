import { getClient } from "@/app/lib/api";
import ClientsContractsTable from "@/app/components/Tables/ClientsContractsTable";

export default async function ClientPage({ params, }: { params: Promise<{ clientId: string }>})
{
    const { clientId } = await params;

    try{
        const { client, contracts } = await getClient(clientId);

        console.log(contracts);

        return(
            <main>
                <h1>{client.name}</h1>
                <h2>{client.document}</h2>
                <h2>{client.location}</h2>
                <h2>{client.phone}</h2>

                <h2>Contracts</h2>

                <ClientsContractsTable clientId={client.id} contracts={contracts}></ClientsContractsTable>
                
            </main>
        );
    }catch(err)
    {
        console.log("ERROR: " + err);
        return <main>Failed to get data!</main>
    }
    
    
}