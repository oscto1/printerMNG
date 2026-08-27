"use client"

import { useState } from "react";
import { Brand } from "@/app/[locale]/types/Printers/Brand";
import Modal from "../../Modal";
import { CreatePrinter } from "@/app/[locale]/types/Printers/CreatePrinter";
import { createPrinter } from "@/app/[locale]/lib/apiRequests";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { CustomApiError } from "@/app/[locale]/lib/apiUtils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CreatePrinterAction({brands}:{brands: Brand[]}){

    const [openCreatePrinter, setOpenCreatePrinter] = useState(false);
    const [newPrinter, setNewPrinter] = useState({brandId: -1, modelName: "", isColorPrinter: false} as CreatePrinter);

    const { showError } = useError();

    const t = useTranslations();

    const router = useRouter();
    const handleCreatePrinter = async (printer: CreatePrinter) => {
        try{
            await createPrinter(printer);
            setOpenCreatePrinter(false);
            window.location.reload();
        }catch(err){
            showError(err);
            if(err instanceof CustomApiError && err.data.includes("UNAUTHORIZED")){
                window.location.reload();
            }
        }
    }
    return(
    <>
        <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenCreatePrinter(true)}}>{t("printers.addPrinter")}</button>

        <Modal open={openCreatePrinter} onClose={()=>{setOpenCreatePrinter(false)}}>
            <form action="">
                <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">{t("printers.addPrinter")}</h1>
                
                <h2>{t("printers.brand")}</h2>
                <select
                    value={newPrinter.brandId}
                    onChange={(e) => 
                        setNewPrinter({
                            ...newPrinter,
                            brandId: Number(e.target.value)
                        })
                    }
                    className="w-100 mb-5"
                >
                    <option key={-1} value={-1}>Select a brand</option>
                    {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>

                <h2>{t("printers.name")}</h2>
                <input className="w-100 mb-5" type="text"
                    onChange={(e) => 
                        setNewPrinter({
                            ...newPrinter,
                            modelName: e.target.value
                        })
                    }/>

                <h2>{t("printers.color")}</h2>
                <label className="relative inline-flex items-center cursor-pointer mb-5">
                    <input
                        type="checkbox"
                        checked={newPrinter.isColorPrinter}
                        onChange={(e) => 
                            setNewPrinter({
                                ...newPrinter,
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
                handleCreatePrinter(newPrinter);
            }
            }>{t("common.save")}</button>
        </Modal>
    </>
    )
}