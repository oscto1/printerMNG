"use client"
import { useState } from "react";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { useRouter } from "next/navigation";
import Modal from "../../Modal";
import { CustomApiError, deletePrinter } from "@/app/[locale]/lib/api";
import { useTranslations } from "next-intl";

export default function DeletePrinterAction({printerId}: {printerId: number}){
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    
    const { showError } = useError();

    const t = useTranslations();

    const router = useRouter();
    const handleConfirmDelete = async (printerId: number) => {
        try{
            await deletePrinter(printerId);
            setOpenDeleteModal(false);
            router.push("/printers");
        }catch(err){
            showError(err);
            if(err instanceof CustomApiError && err.data.includes("UNAUTHORIZED")){
                router.refresh();
            }
        }
    }

    return(
        <>
            <button className="bg-red-300 hover:bg-red-400 rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenDeleteModal(true)}}>{t("printers.deletePrinter")}</button>

            <Modal open={openDeleteModal} onClose={()=>{setOpenDeleteModal(false);}}>
                <h2 className="mt-5 mb-5 text-xl font-bold text-gray-900 tracking-tight">{t("printers.deleteWarn1")}</h2>
                <p>{t("printers.deleteWarn2")}</p>
                <button className="text-black bg-[#D1D1D1] hover:bg-[#C4C4C4] cursor-pointer p-2 rounded mt-5 mr-2" onClick={()=>{setOpenDeleteModal(false);}}>{t("common.cancel")}</button>
                <button className="text-white bg-[#FC6A6A] hover:bg-[#E04F4F] cursor-pointer p-2 rounded mt-5" onClick={() => handleConfirmDelete(printerId)}>{t("common.delete")}</button>          
            </Modal>
        </>
        
    );
}