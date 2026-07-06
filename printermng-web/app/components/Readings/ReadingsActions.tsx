"use client"

import { useState } from "react";
import Modal from "../Modal";
import { MONTHS, currentDate } from "@/app/lib/utils";
import { CreateReading } from "@/app/types/CreateReading";
import { createReading } from "@/app/lib/api";


export default function ReadingsActions({contractId, }: {contractId: number}){
    const [open, setOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [newReading, setNewReading] = useState({ contractId: contractId, month: currentDate(), blackCounter: 0, colorCounter: 0, notes: "" } as CreateReading);

    const handleSave = async (reading: CreateReading) => {
        try{
            setError(null);
            await createReading(reading);
        }catch(err)
        {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    }

    return(
        <>
            <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpen(true)}}>ADD NEW READING</button>

            <Modal open={open} onClose={() => setOpen(false)}>
                {/* <form action="">
                    <select name="" id="">
                        {MONTHS.map((option, index) => (
                            <option key={index} value={index}>
                                {option}
                            </option>
                        ))}
                    </select>
                </form>     */}
                <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">Add reading</h1>
                <form action="">
                    <div>
                        <h2>Month</h2>
                        <div className="text-center flex flex-row gap-2 mb-5">
                                    <select className="text-center w-20"
                                        value={Number(newReading.month.split("-")[1]) - 1}
                                        onChange={(e)=>{
                                            const monthIndex = Number(e.target.value);

                                            setNewReading({
                                                ...newReading,
                                                month: `${newReading.month.split("-")[0]}-${String(monthIndex + 1).padStart(2, "0")}-01`
                                            });
                                        }}
                                        >
                                        {MONTHS.map((option, index) => (
                                            <option key={index} value={index}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                    <input className="text-center w-20"
                                        type="number"
                                        min={1900}
                                        max={2100}
                                        value={newReading.month.split("-")[0]}
                                        onChange={(e)=>{
                                            setNewReading({
                                                ...newReading,
                                                month: `${e.target.value}-${newReading.month.split("-")[1]}-01`
                                            });
                                        }}
                                    />
                                </div>
                    </div>

                    <h2>Black counter</h2>
                    <input id="blackCounter" className="text-left w-30 mb-5" min={0} type="number" placeholder="0"
                            value={newReading.blackCounter}
                            onChange={(e)=>{
                                setNewReading({
                                    ...newReading,
                                    blackCounter: Number(e.target.value)
                                });
                            }}></input>

                    <h2>Color counter</h2>
                    <input className="text-left w-30 mb-5" min={0} type="number" placeholder="0"
                            value={newReading.colorCounter}
                            onChange={(e)=>{
                                setNewReading({
                                    ...newReading,
                                    colorCounter: Number(e.target.value)
                                });
                            }}></input>

                    <h2>Notes</h2>
                    <input className="text-left w-full mb-5" min={0} type="text" placeholder="Notes" 
                            value={newReading.notes}
                            onChange={(e)=>{
                                setNewReading({
                                    ...newReading,
                                    notes: e.target.value
                                });
                            }}></input>
                </form>
                <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => 
                {
                    if(error){
                        return(
                            <Modal open={true} onClose={() => setOpen(false)}>ERROR! {error}</Modal>
                        );
                    }

                    handleSave(newReading);
                }
                }>Save</button>
                
                
            </Modal>  
        </>      
    );
}