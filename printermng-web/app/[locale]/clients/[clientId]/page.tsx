import { getClient } from "@/app/[locale]/lib/apiServer";
import ClientsContractsTable from "@/app/[locale]/components/Tables/ClientsContractsTable";
import CreateContractAction from "@/app/[locale]/components/Actions/Contracts/CreateContractAction";
import PageContext, { UrlItem } from "@/app/[locale]/components/PageContext";
import Header, { HeaderRightItem } from "@/app/[locale]/components/Header";
import EditClientAction from "@/app/[locale]/components/Actions/Clients/EditClientAction";
import DeleteClientAction from "@/app/[locale]/components/Actions/Clients/DeleteClientAction";
import Navbar from "@/app/[locale]/components/Navbar";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AppErrorCode, CustomApiError } from "../../lib/api";

export default async function ClientPage({ params, }: { params: Promise<{ clientId: string }>})
{
    const t = await getTranslations();
    try{
        const { clientId } = await params;

        const { client, contracts } = await getClient(clientId);

        const url = [
            {label: t("clients.title"), value: "/clients"} as UrlItem, 
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
    
                <Navbar></Navbar>
                <PageContext 
                    url={url} title={t("clients.clientOverview")}
                    description={t("clients.singleClientDescription")}>
                </PageContext>

                <div className="flex gap-2">
                    <EditClientAction clientId={Number(clientId)} currentClientData={currentClientData}></EditClientAction>
                    <DeleteClientAction clientId={Number(clientId)}></DeleteClientAction>
                </div>
                

                <Header 
                    title={client.name}
                    leftData={[`${t("clients.document")}: ${client.document}`]}
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
    }catch(err){
        if(err instanceof CustomApiError){
            if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                redirect("/auth/login");
            }else if(err.data.includes("NOT_FOUND" as AppErrorCode)){
                redirect("/clients");
            }  
        }else{
            return(t("SERVER_ERROR"));
        }
    }
    
    
}