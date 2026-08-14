"use client"
import type { CreateClient } from "@/app/[locale]/types/Clients/CreateClient";
import { useState } from "react"
import Modal from "../../Modal";
import { editClient } from "@/app/[locale]/lib/api";
import { useRouter } from "next/navigation";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { EditClient } from "@/app/[locale]/types/Clients/EditClient";
import { useTranslations } from "next-intl";

export default function EditClientAction({clientId, currentClientData}: {clientId: number, currentClientData: EditClient}){
    const [openEditClient, setOpenEditClient] = useState(false);
    const [editedClient, setEditedClient] = useState(currentClientData);

    
    const { showError } = useError();

    const router = useRouter();

    const handleEditClient = async (clientId: number, client: CreateClient) => {
        try{
            await editClient(clientId, client);
            setOpenEditClient(false);
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
            <button className="bg-gray-500 hover:bg-gray-700 rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenEditClient(true)}}>EDIT CLIENT</button>

            <Modal open={openEditClient} onClose={() => setOpenEditClient(false)}>
                <form action="">
                    <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">{t("clients.editClient")}</h1>
                    <h2>{t("clients.name")}</h2>
                    <input className="w-100 mb-5" type="text" 
                        value={editedClient.name}
                        onChange={(e) => {
                            setEditedClient({
                                ...editedClient,
                                name: e.target.value
                            });
                    }}
                    />

                    <h2>{t("clients.document")}</h2>
                    <input className="w-50 mb-5" type="number" 
                        value={editedClient.document}
                        onChange={(e) =>{
                            setEditedClient({
                                ...editedClient,
                                document: e.target.value
                            });
                        }}
                    />

                    <h2>{t("clients.phone")}</h2>
                    <input className="w-50 mb-5" type="number" 
                        value={editedClient.phone}
                        onChange={(e)=>{
                            setEditedClient({
                                ...editedClient,
                                phone: e.target.value
                            });
                        }}
                    />    

                    <h2>{t("clients.location")}</h2>
                    <input className="w-50 mb-5" type="text" 
                        value={editedClient.location}
                        onChange={(e)=>{
                            setEditedClient({
                                ...editedClient,
                                location: e.target.value
                            });
                        }}
                    /> 
                </form>
                

                <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" 
                    onClick={() => {
                        handleEditClient(clientId, editedClient);
                    }}
                >{t("common.save")}</button>   
            </Modal>
        </>
    )
    
}