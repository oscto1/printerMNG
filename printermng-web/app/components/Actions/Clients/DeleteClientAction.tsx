"use client"
import { useState } from "react";
import Modal from "../../Modal";
import { useError } from "@/app/context/ErrorContext";
import { deleteClient } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function DeleteClientAction({clientId}:{clientId: number}){
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { showError } = useError();

    const router = useRouter();
    const handleConfirmDelete = async (clientId: number) => {
        try{
            await deleteClient(clientId);
            setOpenDeleteModal(false);
            router.push("/clients");
        }catch(err){
            showError(err);
        }
    }

    return(
        <>
            <button className="bg-red-300 hover:bg-red-400 rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenDeleteModal(true)}}>DELETE CLIENT</button>

            <Modal open={openDeleteModal} onClose={()=>{setOpenDeleteModal(false);}}>
                <h2 className="mt-5 mb-5 text-xl font-bold text-gray-900 tracking-tight">Are you sure you want to delete this client?</h2>
                <p>This action is irreversible. All contracts and readings will be lost!</p>
                <button className="text-black bg-[#D1D1D1] hover:bg-[#C4C4C4] cursor-pointer p-2 rounded mt-5 mr-2" onClick={()=>{setOpenDeleteModal(false);}}>Cancel</button>
                <button className="text-white bg-[#FC6A6A] hover:bg-[#E04F4F] cursor-pointer p-2 rounded mt-5" onClick={() => handleConfirmDelete(clientId)}>Delete</button>          
            </Modal>
        </>
        
    );
}