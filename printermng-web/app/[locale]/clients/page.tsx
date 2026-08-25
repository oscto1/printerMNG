import { getClients } from "../lib/apiServer";
import { ClientDetails } from "../types/Clients/ClientDetails";
import ClientsTable from "../components/Tables/ClientsTable";
import CreateClientAction from "../components/Actions/Clients/CreateClientAction";
import PageContext, { UrlItem } from "../components/PageContext";
import Navbar from "../components/Navbar";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AppErrorCode, CustomApiError } from "../lib/api";


export default async function ClientsPage()
{
    const t = await getTranslations();
    try{
        
        var url : UrlItem[] = [
            {label: `${t("clients.title")}`, value: "/clients"}
        ]

        var clients: ClientDetails[] = [];

        clients = await getClients();

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
    }catch(err){
        if(err instanceof CustomApiError){
            if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                redirect("/auth/login");
            }
        }else{
            return(t("errors.SERVER_ERROR"));
        }
    }

}