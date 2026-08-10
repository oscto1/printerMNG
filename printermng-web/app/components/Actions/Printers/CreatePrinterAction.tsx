"use client"

import { useState } from "react";
import { Brand } from "@/app/types/Printers/Brand";
import Modal from "../../Modal";
import { CreatePrinter } from "@/app/types/Printers/CreatePrinter";
import { useError } from "@/app/context/ErrorContext";
import { createPrinter } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function CreatePrinterAction({brands}:{brands: Brand[]}){

    const [openCreatePrinter, setOpenCreatePrinter] = useState(false);
    const [newPrinter, setNewPrinter] = useState({brandId: -1, modelName: "", isColorPrinter: false} as CreatePrinter);

    const { showError } = useError();

    const router = useRouter();
    const handleCreatePrinter = async (printer: CreatePrinter) => {
        try{
            await createPrinter(printer);
            setOpenCreatePrinter(false);
            window.location.reload();
        }catch(err){
            showError(err);
        }
    }
    return(
    <>
        <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenCreatePrinter(true)}}>ADD NEW PRINTER</button>

        <Modal open={openCreatePrinter} onClose={()=>{setOpenCreatePrinter(false)}}>
            <form action="">
                <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">Add printer</h1>
                
                <h2>Brand</h2>
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

                <h2>Model name</h2>
                <input className="w-100 mb-5" type="text"
                    onChange={(e) => 
                        setNewPrinter({
                            ...newPrinter,
                            modelName: e.target.value
                        })
                    }/>

                <h2>Color printer</h2>
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
            }>Save</button>
        </Modal>
    </>
    )
}