"use client"
import { useState } from "react";
import Modal from "../../Modal";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { deleteClient } from "@/app/[locale]/lib/api";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DeleteClientAction({clientId}:{clientId: number}){
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { showError } = useError();

    const router = useRouter();

    const t = useTranslations();

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
            <button className="bg-red-300 hover:bg-red-400 rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenDeleteModal(true)}}>{t("clients.deleteClient")}</button>

            <Modal open={openDeleteModal} onClose={()=>{setOpenDeleteModal(false);}}>
                <h2 className="mt-5 mb-5 text-xl font-bold text-gray-900 tracking-tight">{t("clients.deleteWarn1")}</h2>
                <p>{t("clients.deleteWarn2")}</p>
                <button className="text-black bg-[#D1D1D1] hover:bg-[#C4C4C4] cursor-pointer p-2 rounded mt-5 mr-2" onClick={()=>{setOpenDeleteModal(false);}}>{t("common.cancel")}</button>
                <button className="text-white bg-[#FC6A6A] hover:bg-[#E04F4F] cursor-pointer p-2 rounded mt-5" onClick={() => handleConfirmDelete(clientId)}>{t("common.delete")}</button>          
            </Modal>
        </>
        
    );
}