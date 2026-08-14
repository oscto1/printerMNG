"use client"

import { useState } from "react";
import Modal from "../Modal";
import { MONTHS, currentDate } from "@/app/[locale]/lib/utils";
import { CreateReading } from "@/app/[locale]/types/Readings/CreateReading";
import { createReading } from "@/app/[locale]/lib/api";
import { useRouter } from "next/navigation";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { useTranslations } from "next-intl";


export default function ReadingsActions({contractId, contractIsActive}: {contractId: number, contractIsActive: boolean}){
    const [openCreateReading, setOpenCreateReading] = useState(false);

    // const [openErrorModal, setOpenErrorModal] = useState(false);

    // const [error, setError] = useState<string | null>(null);

    const { showError } = useError();

    const [newReading, setNewReading] = useState({ contractId: contractId, month: currentDate(), blackCounter: 0, colorCounter: 0, notes: "" } as CreateReading);

    const router = useRouter();

    const t = useTranslations();

    const handleSave = async (reading: CreateReading) => {
        try{
            await createReading(reading);
            setOpenCreateReading(false);
            
            window.location.reload();
        }catch(err)
        {
            showError(err);
        }
    }

    return(
        <>
            {
                (contractIsActive ? 
                    <button className="bg-[#7AE972] hover:bg-[#4ECF44] rounded px-3 py-2 text-sm text-white cursor-pointer" onClick={() => {setOpenCreateReading(true)}}>{t("readings.addReading")}</button>
                    : ""
                )
            }
            
            
            <Modal open={openCreateReading} onClose={() => setOpenCreateReading(false)}>
                {/* <form action="">
                    <select name="" id="">
                        {MONTHS.map((option, index) => (
                            <option key={index} value={index}>
                                {option}
                            </option>
                        ))}
                    </select>
                </form>     */}
                <h1 className="text-heading md:text-2xl lg:text-2xl mb-3">{t("readings.addReading")}</h1>
                <form action="">
                    <div>
                        <h2>{t("readings.month")}</h2>
                        <div className="text-center flex flex-row gap-2 mb-5">
                                    <select className="text-center w-20"
                                        value={Number(newReading.month.split("-")[1]) - 1}
                                        onChange={(e)=>{
                                            const monthIndex = Number(e.target.value);

                                            setNewReading({
                                                ...newReading,
                                                month: `${newReading.month.split("-")[0]}-${String(monthIndex + 1).padStart(2, "0")}`
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
                                                month: `${e.target.value}-${newReading.month.split("-")[1]}`
                                            });
                                        }}
                                    />
                                </div>
                    </div>

                    <h2>{t("readings.blackCounter")}</h2>
                    <input id="blackCounter" className="text-left w-30 mb-5" min={0} type="number" placeholder="0"
                            value={newReading.blackCounter}
                            onChange={(e)=>{
                                setNewReading({
                                    ...newReading,
                                    blackCounter: Number(e.target.value)
                                });
                            }}></input>

                    <h2>{t("readings.colorCounter")}</h2>
                    <input className="text-left w-30 mb-5" min={0} type="number" placeholder="0"
                            value={newReading.colorCounter}
                            onChange={(e)=>{
                                setNewReading({
                                    ...newReading,
                                    colorCounter: Number(e.target.value)
                                });
                            }}></input>

                    <h2>{t("readings.notes")}</h2>
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
                    handleSave(newReading);
                }
                }>{t("common.save")}</button>     
            </Modal>
            {/* <Modal open={openErrorModal} onClose={() => setOpenErrorModal(false)}>ERROR! {error}</Modal> */}
        </>      
    );
}