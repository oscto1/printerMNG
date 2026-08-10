"use client"
import { useState, useEffect } from "react";
import Modal from "../../Modal";
import type { CreateContract } from "@/app/types/Contracts/CreateContract";
import { getPrinters } from "@/app/lib/api";
import { PrinterSummary } from "@/app/types/Printers/PrinterSummary";
import { createContract } from "@/app/lib/api";
import { useError } from "@/app/context/ErrorContext";
import { useRouter } from "next/navigation";

export default function CreateContract({clientId} : {clientId: number}){
    const today = new Date().toISOString().split("T")[0];

    const [openCreateContract, setOpenCreateContract] = useState(false);
    const [newContract, setNewContract] = useState({clientId: clientId, printerId: -1, minimumCharge: 0, blackCopyPrice: 0, colorCopyPrice: 0, startDate: today, billDay: Number(today.split("-")[2])} as CreateContract);

    const [printerList, setPrinterList] = useState([] as PrinterSummary[]);
    
    const colorPrinters = printerList.filter(p => p.isColorPrinter);
    const blackPrinters = printerList.filter(p => !p.isColorPrinter);

    const { showError } = useError();

    useEffect(() => {
        const handleGetPrinters = async () => {
            try {
                const printers = await getPrinters();
                setPrinterList(printers);

            } catch (err) {
                showError(err);
            }
        };

        handleGetPrinters();

    }, []);

    const router = useRouter()
    const handleCreateContract = async () => {
        try{
            await createContract(newContract);
            setOpenCreateContract(false);
            router.refresh();
        }
        catch(err){
            showError(err);
        }
    }

    return(
        <>
            <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenCreateContract(true)}}>ADD NEW CONTRACT</button>

            <Modal open={openCreateContract} onClose={()=>{setOpenCreateContract(false)}}>
                <form action="">
                    <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">Add contract</h1>
                    
                    <h2>Printer</h2>
                    <select
                        value={newContract.printerId}
                        onChange={(e) =>
                            setNewContract({
                                ...newContract,
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
                        value={newContract.minimumCharge} 
                        onChange={(e) => {
                            setNewContract({
                                ...newContract,
                                minimumCharge: Number(e.target.value)
                            });
                        }}
                    />

                    <h2>Black copy price</h2>
                    <input type="number" 
                        className="mb-5"
                        value={newContract.blackCopyPrice}
                        onChange={(e) => {
                            setNewContract({
                                ...newContract,
                                blackCopyPrice: Number(e.target.value)
                            });
                        }}
                    />

                    <h2>Color copy price</h2>
                    <input type="number" 
                        className="mb-5"
                        value={newContract.colorCopyPrice}
                        onChange={(e) => {
                            setNewContract({
                                ...newContract,
                                colorCopyPrice: Number(e.target.value)
                            });
                        }}
                    />

                    <h2>Start date</h2>
                    <input type="date" 
                        className="mb-5"
                        value={newContract.startDate}
                        onChange={(e)=>{
                            const date = e.target.value;

                            setNewContract({
                                ...newContract,
                                startDate: date,
                                billDay: Number(date.split("-")[2])
                            });
                        }}
                    />

                </form>


                <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => 
                {
                    handleCreateContract();
                }
                }>Save</button> 
            </Modal>
        </>
    )
}