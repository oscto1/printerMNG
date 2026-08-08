import { getClient } from "@/app/lib/api";
import ClientsContractsTable from "@/app/components/Tables/ClientsContractsTable";
import CreateContractAction from "@/app/components/Actions/Contracts/CreateContractAction";
import PageContext, { UrlItem } from "@/app/components/PageContext";
import Header, { HeaderRightItem } from "@/app/components/Header";
import EditClientAction from "@/app/components/Actions/Clients/EditClientAction";

export default async function ClientPage({ params, }: { params: Promise<{ clientId: string }>})
{
    const { clientId } = await params;

    try{
        const { client, contracts } = await getClient(clientId);

        const url = [
            {label: "Clients", value: "/clients"} as UrlItem, 
            {label: client.name, value: `/clients/${clientId}`} as UrlItem
        ];

        const rightItems : HeaderRightItem[] = [
            { imgUrl: "/img/location.svg", text: client.location},
            { imgUrl: "/img/phone.svg", text: client.phone}
        ]

        const currentClientData = {
            document: client.document,
            name: client.name,
            phone: client.phone,
            location: client.location
        }

        return(
            <main className="w-full mx-auto px-4 py-8 space-y-6">
    
                <PageContext 
                    url={url} title="Client Overview"
                    description="View detailed client profile information, manage contact data, and oversee all associated contracts.">
                </PageContext>

                <EditClientAction clientId={Number(clientId)} currentClientData={currentClientData}></EditClientAction>

                <Header 
                    title={client.name}
                    leftData={[`Document ID: ${client.document}`]}
                    rightItems={rightItems}
                    >  
                </Header>

                <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Contracts</h2>
                        <CreateContractAction clientId={client.id} />
                    </div>

                    <ClientsContractsTable clientId={client.id} contracts={contracts} />
                </div>

            </main>
        );
    }catch(err)
    {
        console.log("ERROR: " + err);
        return <main>Failed to get data!</main>
    }
    
    
}