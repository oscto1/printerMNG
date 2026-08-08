"use client"
import type { CreateClient } from "@/app/types/Clients/CreateClient";
import { useState, useEffect } from "react"
import Modal from "../../Modal";
import { editContract } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useError } from "@/app/context/ErrorContext";
import { EditContract } from "@/app/types/Contracts/EditContract";
import { PrinterSummary } from "@/app/types/Printers/PrinterSummary";
import { getPrinters } from "@/app/lib/api";

export default function EditContractAction({contractId, currentContractData}: {contractId: number, currentContractData: EditContract}){
    const [openEditContract, setOpenEditContract] = useState(false);
    const [editedContract, setEditedContract] = useState(currentContractData);

    const [printerList, setPrinterList] = useState([] as PrinterSummary[]);

    const colorPrinters = printerList.filter(p => p.isColorPrinter);
    const blackPrinters = printerList.filter(p => !p.isColorPrinter);

    const { showError } = useError();

    const router = useRouter();
    const handleEditContract = async (contractId: number, contract: EditContract) => {
        try{
            await editContract(contractId, contract);
            setOpenEditContract(false);
            router.refresh();
        }
        catch(err){
            console.log(err);
            showError(err);
        }
    }

    useEffect(() => {
            const handleGetPrinters = async () => {
                try {
                    const printers = await getPrinters();
                    setPrinterList(printers);
    
                } catch (err) {
                    console.error(err);
                }
            };
    
            handleGetPrinters();
    
        }, []);

    return(
        <>
            <button className="bg-gray-500 hover:bg-gray-700 rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenEditContract(true)}}>EDIT CONTRACT</button>

            <Modal open={openEditContract} onClose={()=>{setOpenEditContract(false)}}>
                <form action="">
                    <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">Add contract</h1>
                    
                    <h2>Status</h2>
                    <label className="relative inline-flex items-center cursor-pointer mb-5">
                        <input
                            type="checkbox"
                            checked={editedContract.isActive}
                            onChange={(e) =>
                                setEditedContract({
                                    ...editedContract,
                                    isActive: e.target.checked,
                                })
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5CFF61]"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                            {editedContract.isActive ? "Active" : "Inactive"}
                        </span>
                    </label>

                    <h2>Printer</h2>
                    <select
                        value={editedContract.printerId}
                        onChange={(e) =>
                            setEditedContract({
                                ...editedContract,
                                printerId: Number(e.target.value),
                            })
                        }
                        className="w-100 mb-5"
                    >
                        <option key={-1} value={-1}>Select a printer</option>

                        <optgroup label="Color Printers">
                            {colorPrinters.map((printer) => (
                                <option key={printer.id} value={printer.id}>
                                    {printer.brand + " " + printer.modelName}
                                </option>
                            ))}
                        </optgroup>

                        <optgroup label="Black & White Printers">
                            {blackPrinters.map((printer) => (
                                <option key={printer.id} value={printer.id}>
                                    {printer.brand + " " + printer.modelName}
                                </option>
                            ))}
                        </optgroup>
                    </select>

                    <h2>Fixed charge</h2>
                    <input type="number" 
                        className="mb-5"
                        value={editedContract.minimumCharge} 
                        onChange={(e) => {
                            setEditedContract({
                                ...editedContract,
                                minimumCharge: Number(e.target.value)
                            });
                        }}
                    />

                    <h2>Black copy price</h2>
                    <input type="number" 
                        className="mb-5"
                        value={editedContract.blackCopyPrice}
                        onChange={(e) => {
                            setEditedContract({
                                ...editedContract,
                                blackCopyPrice: Number(e.target.value)
                            });
                        }}
                    />

                    <h2>Color copy price</h2>
                    <input type="number" 
                        className="mb-5"
                        value={editedContract.colorCopyPrice}
                        onChange={(e) => {
                            setEditedContract({
                                ...editedContract,
                                colorCopyPrice: Number(e.target.value)
                            });
                        }}
                    />

                    <h2>Start date</h2>
                    <input type="date" 
                        className="mb-5"
                        value={editedContract.startDate}
                        onChange={(e)=>{
                            const date = e.target.value;

                            setEditedContract({
                                ...editedContract,
                                startDate: date,
                                billDay: Number(date.split("-")[2])
                            });
                        }}
                    />

                </form>


                <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => 
                {
                    handleEditContract(contractId, editedContract);
                }
                }>Save</button> 
            </Modal>
        </>
    )
    
}