"use client"
import type { CreateClient } from "@/app/[locale]/types/Clients/CreateClient";
import { useState } from "react"
import Modal from "../../Modal";
import { createClient } from "@/app/[locale]/lib/api";
import { useRouter } from "next/navigation";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { useTranslations } from "next-intl";

export default function CreateClientAction(){
    const [openCreateClient, setOpenCreateClient] = useState(false);
    const [newClient, setNewClient] = useState({document: "", name: "", phone: "", location: ""} as CreateClient);

    
    const { showError } = useError();

    const router = useRouter();
    const handleCreateClient = async (client: CreateClient) => {
        try{
            await createClient(client);
            setOpenCreateClient(false);
            router.refresh();
        }
        catch(err){
            console.log(err);
            showError(err);
        }
    }

    const t = useTranslations();

    return(
        <>
            <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenCreateClient(true)}}>{t("clients.addClient")}</button>

            <Modal open={openCreateClient} onClose={() => setOpenCreateClient(false)}>
                <form action="">
                    <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">{t("clients.addClient")}</h1>
                    <h2>{t("clients.name")}</h2>
                    <input className="w-100 mb-5" type="text" 
                        value={newClient.name}
                        onChange={(e) => {
                            setNewClient({
                                ...newClient,
                                name: e.target.value
                            });
                    }}
                    />

                    <h2>{t("clients.document")}</h2>
                    <input className="w-50 mb-5" type="number" 
                        value={newClient.document}
                        onChange={(e) =>{
                            setNewClient({
                                ...newClient,
                                document: e.target.value
                            });
                        }}
                    />

                    <h2>{t("clients.phone")}</h2>
                    <input className="w-50 mb-5" type="number" 
                        value={newClient.phone}
                        onChange={(e)=>{
                            setNewClient({
                                ...newClient,
                                phone: e.target.value
                            });
                        }}
                    />    

                    <h2>{t("clients.location")}</h2>
                    <input className="w-50 mb-5" type="text" 
                        value={newClient.location}
                        onChange={(e)=>{
                            setNewClient({
                                ...newClient,
                                location: e.target.value
                            });
                        }}
                    /> 
                </form>
                

                <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" 
                    onClick={() => {
                        handleCreateClient(newClient);
                    }}
                >{t("common.create")}</button>   
            </Modal>
        </>
    )
    
}