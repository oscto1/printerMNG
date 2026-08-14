"use client"
import { useState } from "react";
import Modal from "../../Modal";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { deleteContract } from "@/app/[locale]/lib/api";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DeleteContractAction({contractId, clientId}:{contractId: number, clientId: number}){
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { showError } = useError();

    const router = useRouter();
    const handleConfirmDelete = async (contractId: number) => {
        try{
            await deleteContract(contractId);
            setOpenDeleteModal(false);
            router.push(`/clients/${clientId}`);
        }catch(err){
            showError(err);
        }
    }

    const t = useTranslations();

    return(
        <>
            <button className="bg-red-300 hover:bg-red-400 rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenDeleteModal(true)}}>{t("contracts.deleteContract")}</button>

            <Modal open={openDeleteModal} onClose={()=>{setOpenDeleteModal(false);}}>
                <h2 className="mt-5 mb-5 text-xl font-bold text-gray-900 tracking-tight">{t("contracts.deleteWarn1")}</h2>
                <p>{t("contracts.deleteWarn2")}</p>
                <button className="text-black bg-[#D1D1D1] hover:bg-[#C4C4C4] cursor-pointer p-2 rounded mt-5 mr-2" onClick={()=>{setOpenDeleteModal(false);}}>Cancel</button>
                <button className="text-white bg-[#FC6A6A] hover:bg-[#E04F4F] cursor-pointer p-2 rounded mt-5" onClick={() => handleConfirmDelete(contractId)}>Delete</button>          
            </Modal>
        </>
        
    );
}