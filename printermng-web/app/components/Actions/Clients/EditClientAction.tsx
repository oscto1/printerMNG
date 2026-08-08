"use client"
import type { CreateClient } from "@/app/types/Clients/CreateClient";
import { useState } from "react"
import Modal from "../../Modal";
import { editClient } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useError } from "@/app/context/ErrorContext";
import { EditClient } from "@/app/types/Clients/EditClient";

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

    return(
        <>
            <button className="bg-gray-300 hover:bg-gray-400 rounded px-3 py-2 text-sm text-gray-800 cursor-pointer" onClick={() => {setOpenEditClient(true)}}>EDIT CLIENT</button>

            <Modal open={openEditClient} onClose={() => setOpenEditClient(false)}>
                <form action="">
                    <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">Edit Client</h1>
                    <h2>Name</h2>
                    <input className="w-100 mb-5" type="text" 
                        value={editedClient.name}
                        onChange={(e) => {
                            setEditedClient({
                                ...editedClient,
                                name: e.target.value
                            });
                    }}
                    />

                    <h2>Document</h2>
                    <input className="w-50 mb-5" type="number" 
                        value={editedClient.document}
                        onChange={(e) =>{
                            setEditedClient({
                                ...editedClient,
                                document: e.target.value
                            });
                        }}
                    />

                    <h2>Phone</h2>
                    <input className="w-50 mb-5" type="number" 
                        value={editedClient.phone}
                        onChange={(e)=>{
                            setEditedClient({
                                ...editedClient,
                                phone: e.target.value
                            });
                        }}
                    />    

                    <h2>Location</h2>
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
                >Save</button>   
            </Modal>
        </>
    )
    
}