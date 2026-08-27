'use client'

import { getClient } from "@/app/[locale]/lib/apiRequests";
import ClientsContractsTable from "@/app/[locale]/components/Tables/ClientsContractsTable";
import CreateContractAction from "@/app/[locale]/components/Actions/Contracts/CreateContractAction";
import PageContext, { UrlItem } from "@/app/[locale]/components/PageContext";
import Header, { HeaderRightItem } from "@/app/[locale]/components/Header";
import EditClientAction from "@/app/[locale]/components/Actions/Clients/EditClientAction";
import DeleteClientAction from "@/app/[locale]/components/Actions/Clients/DeleteClientAction";
import Navbar from "@/app/[locale]/components/Navbar";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { AppErrorCode, CustomApiError } from "../../lib/apiUtils";
import { useEffect, useState, use } from "react";
import { ClientDetails } from "../../types/Clients/ClientDetails";
import { ContractDetails } from "../../types/Contracts/ContractDetails";

export default function ClientPage({ params, }: { params: Promise<{ clientId: string }>})
{
    const t = useTranslations();

    const { clientId } = use(params);

        const [ client, setClient ] = useState<ClientDetails>({id: -1, document:"", name:"", phone:"", location:""});
        const [ contracts, setContracts ] = useState<ContractDetails[]>([]);

        const [isLoading, setIsLoading] = useState(true);
        const [serverError, setServerError] = useState(false);

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

        useEffect(() => {
            const loadClient = async () => {
                try{
                    const result = await getClient(clientId);

                    setClient(result.client);
                    setContracts(result.contracts);
                }catch(err){
                    if(err instanceof CustomApiError){
                        if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                            redirect("/auth/login");
                        }
                    }else{
                        console.error(err);
                        setServerError(true);
                    }
                }finally{
                    setIsLoading(false);
                }
                
            };

            loadClient();
        }, [clientId]);

        if(isLoading) return <main className="w-full mx-auto px-4 py-8 space-y-6"><p>Loading...</p></main>
        if(serverError) return <main className="w-full mx-auto px-4 py-8 space-y-6"><p>{t("errors.SERVER_ERROR")}</p></main>
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
}