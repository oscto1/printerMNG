'use client'

import { getClients } from "../lib/apiRequests";
import { ClientDetails } from "../types/Clients/ClientDetails";
import ClientsTable from "../components/Tables/ClientsTable";
import CreateClientAction from "../components/Actions/Clients/CreateClientAction";
import PageContext, { UrlItem } from "../components/PageContext";
import Navbar from "../components/Navbar";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { AppErrorCode, CustomApiError } from "../lib/apiUtils";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";


export default function ClientsPage()
{
    const t = useTranslations();

    var url : UrlItem[] = [
            {label: `${t("clients.title")}`, value: "/clients"}
        ]

        const [clients, setClients] = useState<ClientDetails[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [serverError, setServerError] = useState(false);

        useEffect(() => {
            getClients().then(setClients).catch(err => {
                if(err instanceof CustomApiError){
                    if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                        redirect("/auth/login");
                    }
                }else{
                    console.error(err);
                    setServerError(true);
                }
            }).finally(() => setIsLoading(false));
        }, []);
        
        if(isLoading) return <Loading />
        if(serverError) return <main className="w-full mx-auto px-4 py-8 space-y-6"><p>{t("errors.SERVER_ERROR")}</p></main>
        return (
        <main className="w-full mx-auto px-4 py-8 space-y-6">
            <Navbar></Navbar>
            <PageContext url={url} title={t("clients.title")} 
                        description={t("clients.description")}></PageContext>



            <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t("clients.tableTitle")}</h2>
                    <CreateClientAction></CreateClientAction>
                </div>

                <ClientsTable clients={clients}></ClientsTable>
            </div>

        </main>
    );
}