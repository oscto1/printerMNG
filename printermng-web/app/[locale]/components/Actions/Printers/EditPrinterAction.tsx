"use client"

import { useState } from "react";
import Modal from "../../Modal";
import { Brand } from "@/app/[locale]/types/Printers/Brand";
import { EditPrinter } from "@/app/[locale]/types/Printers/EditPrinter";
import { PrinterDetails } from "@/app/[locale]/types/Printers/PrinterDetails";
import { CustomApiError, editPrinter } from "@/app/[locale]/lib/api";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditPrinterAction({currentPrinter, brands}: {currentPrinter: PrinterDetails, brands: Brand[]}){

    const [openEditPrinter, setOpenEditPrinter] = useState(false);
    const [editedPrinter, setEditedPrinter] = useState({brandId: currentPrinter.brandId, modelName: currentPrinter.modelName, isColorPrinter: currentPrinter.isColorPrinter} as EditPrinter);

    const { showError } = useError();
    const router = useRouter();

    const t = useTranslations();
     
    const handleEditPrinter = async (printerId: number, printer: EditPrinter) => {
        try{
            await editPrinter(printerId, printer);
            setOpenEditPrinter(false);
            router.refresh();
        }catch(err){
            showError(err);
            if(err instanceof CustomApiError && err.data.includes("UNAUTHORIZED")){
                router.refresh();
            }
        }
    }

    return(
        <>
            <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenEditPrinter(true)}}>{t("printers.editPrinter")}</button>
    
            <Modal open={openEditPrinter} onClose={()=>{setOpenEditPrinter(false)}}>
                <form action="">
                    <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">{t("printers.editPrinter")}</h1>
                    
                    <h2>{t("printers.brand")}</h2>
                    <select
                        value={editedPrinter.brandId}
                        onChange={(e) => 
                            setEditedPrinter({
                                ...editedPrinter,
                                brandId: Number(e.target.value)
                            })
                        }
                        className="w-100 mb-5"
                    >
                        <option key={-1} value={-1}>{t("printers.selectBrand")}</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
    
                    <h2>{t("printers.name")}</h2>
                    <input className="w-100 mb-5" type="text"
                        value={editedPrinter.modelName}
                        onChange={(e) => 
                            setEditedPrinter({
                                ...editedPrinter,
                                modelName: e.target.value
                            })
                        }/>
    
                    <h2>{t("printers.color")}</h2>
                    <label className="relative inline-flex items-center cursor-pointer mb-5">
                        <input
                            type="checkbox"
                            checked={editedPrinter.isColorPrinter}
                            onChange={(e) => 
                                setEditedPrinter({
                                    ...editedPrinter,
                                    isColorPrinter: e.target.checked
                                })
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5CFF61]"></div>
                    </label>
                </form>
    
                <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => 
                {
                    handleEditPrinter(currentPrinter.id, editedPrinter);
                }
                }>{t("common.save")}</button>
            </Modal>
        </>
    );
}