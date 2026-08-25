"use client";
import React, { useState } from "react";
import { ReadingSummary } from "../../types/Readings/ReadingSummary";
import { ContractSummary } from "../../types/Contracts/ContractSummary";
import { formatDate, formatMoney } from "../../lib/utils";
import Image from "next/image";
import { MONTHS } from "../../lib/utils";
import { EditReading } from "@/app/[locale]/types/Readings/EditReading";
import Modal from "../Modal";
import { CustomApiError, deleteReading, editReading } from "@/app/[locale]/lib/api";
import { useRouter } from "next/navigation";
import { useError } from "@/app/[locale]/context/ErrorContext";
import { removeDay } from "../../lib/utils";
import { useTranslations } from "next-intl";


export default function ReadingsTable({ contract, readings }: {contract: ContractSummary, readings: ReadingSummary[]}){

    const router = useRouter();
    const { showError } = useError();

    const edited : EditReading = {
        month: readings[0]?.month,
        blackCounter: readings[0]?.blackCounter,
        colorCounter: readings[0]?.colorCounter,
        notes: readings[0]?.notes
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editedReading, setEditedReading] = useState(edited);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [readingToDelete, setReadingToDelete] = useState(-1);

    const t = useTranslations();

    const handleSaveEdited = async (contractId: number, readingId: number, editedReading: EditReading) => {
        if(!isEditing) return;

        try{
            editedReading.month = removeDay(editedReading.month);
            await editReading(contractId, readingId, editedReading);
            router.refresh();
        }catch(err){
            showError(err);
            if(err instanceof CustomApiError && err.data.includes("UNAUTHORIZED")){
                router.refresh();
            }
        }
    }

    const handleClickDelete = (readingId: number) => {
        setOpenDeleteModal(true);
        setReadingToDelete(readingId);
    }

    const handleConfirmDelete = async () => {
        try{
            await deleteReading(contract.id, readingToDelete);
            setOpenDeleteModal(false);
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
            <Modal open={openDeleteModal} onClose={()=>{setOpenDeleteModal(false); setReadingToDelete(-1)}}>
                <h2 className="mt-5">{t("readings.deleteWarn1")}</h2>
                <button className="text-black bg-[#D1D1D1] hover:bg-[#C4C4C4] cursor-pointer p-2 rounded mt-5 mr-2" onClick={()=>{setOpenDeleteModal(false); setReadingToDelete(-1)}}>{t("common.cancel")}</button>
                <button className="text-white bg-[#FC6A6A] hover:bg-[#E04F4F] cursor-pointer p-2 rounded mt-5" onClick={() => handleConfirmDelete()}>{t("common.delete")}</button>
                
            </Modal>
            <table className="w-full border">
                        <thead>
                            <tr className="border-b">
                                <th className="text-center p-2">{t("readings.month")}</th>
                                <th className="text-center p-2">{t("readings.blackCounter")}</th>
                                <th className="text-center p-2">{t("readings.blackCopiesUsed")}</th>
                                <th className="text-center p-2">{t("readings.blackCharge")}</th>
                                <th className="text-center p-2">{t("readings.colorCounter")}</th>
                                <th className="text-center p-2">{t("readings.colorCopiesUsed")}</th>
                                <th className="text-center p-2">{t("readings.colorCharge")}</th>
                                <th className="text-center p-2">{t("readings.totalCharge")}</th>
                                {/* <th className="text-center p-2">Notes</th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {
                                ((readings.length > 0) ? 
                                    readings.map((reading, index) => (
                                        <React.Fragment key={reading.id}>
                                            <tr key={reading.id}>
                                                <td className="bg-[#94FF97] relative text-center w-30 rounded-tl-lg border-t-2 border-b-1 border-l-2 border-solid border-gray-200">
                                                    {(index === 0 && contract.isActive) && (
                                                    <button
                                                        onClick={() => {
                                                                        setIsEditing(prev => !prev);

                                                                        handleSaveEdited(contract.id, reading.id, editedReading);
                                                                    }}
                                                        className={`absolute top-1/2 -left-10 -translate-y-1/2 rounded px-3 py-2 text-sm text-white cursor-pointer editButton ${
                                                            isEditing ? 'bg-[#7AE972] hover:bg-[#4ECF44]' : 'bg-[#3DA1E3] hover:bg-[#1A78B7]'
                                                        }`}
                                                    >
                                                        <Image src={isEditing ? "/img/save.svg" : "/img/edit.svg"} width={20} height={20} alt="logo"></Image>
                                                    </button>
                                                    )}

                                                    {(index === 0 && isEditing) ? 
                                                        
                                                        <div>
                                                            <select
                                                                value={Number(editedReading.month.split("-")[1]) - 1}
                                                                onChange={(e) => {
                                                                        const monthIndex = Number(e.target.value);

                                                                        setEditedReading({
                                                                        ...editedReading,
                                                                        month: `${editedReading.month.split("-")[0]}-${String(monthIndex + 1).padStart(2, "0")}-01`
                                                                    });
                                                                }}
                                                                >
                                                                {MONTHS.map((option, index) => (
                                                                    <option key={index} value={index}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <input
                                                                className="text-center w-20"
                                                                type="number"
                                                                min={1900}
                                                                max={2100}
                                                                value={editedReading.month.split("-")[0]}
                                                                onChange={(e) => {
                                                                    setEditedReading({
                                                                        ...editedReading,
                                                                        month: `${e.target.value}-${editedReading.month.split("-")[1]}-01`
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                        
                                                        : formatDate(reading.month)}
                                                </td>

                                                {/* <td className="text-center">{formatDate(reading.month)}</td> */}
                                                <td className="text-center border-t-2 border-b-1 border-solid border-gray-200">
                                                    {(index === 0 && isEditing)? <input className="text-center w-25" min={0} type="number" 
                                                                                                                value={editedReading.blackCounter} 
                                                                                                                onChange={(e)=>{ 
                                                                                                                    setEditedReading({
                                                                                                                        ...editedReading,
                                                                                                                        blackCounter: Number(e.target.value)
                                                                                                                    })
                                                                                                                }}></input> 
                                                                                                            : reading.blackCounter}</td>
                                                <td className="text-center border-t-2 border-b-1 border-solid border-gray-200 bg-[#EAECEB]">{reading.blackCopiesUsed}</td>
                                                <td className="text-center border-t-2 border-b-1 border-solid border-gray-200">{(index === 0 && isEditing) ? "-" : formatMoney.format(reading.blackCharge)}</td>
                                                <td className="text-center border-t-2 border-b-1 border-solid border-gray-200">{(!contract.isColorPrinter) ? " -" : (index === 0 && isEditing) ? <input className="text-center" min={0} type="number" value={editedReading.colorCounter}
                                                                                                                                                    onChange={(e)=>{
                                                                                                                                                        setEditedReading({
                                                                                                                                                            ...editedReading,
                                                                                                                                                            colorCounter: Number(e.target.value)
                                                                                                                                                        })
                                                                                                                                                    }}></input>
                                                                                                                                            : reading.colorCounter}</td>
                                                <td className="text-center border-t-2 border-b-1 border-solid border-gray-200 bg-[#EAECEB]">{contract.isColorPrinter ? reading.colorCopiesUsed : "-"}</td>
                                                <td className="text-center border-t-2 border-b-1 border-solid border-gray-200">{(!contract.isColorPrinter || (index === 0 && isEditing)) ? "-" : formatMoney.format(reading.colorCharge) }</td>
                                                <td className="relative text-center rounded-tr-lg border-t-2 border-r-2 border-b-1 border-solid border-gray-200">{((index === 0 && contract.isActive) && (<button className={`absolute top-1/2 -right-10 -translate-y-1/2 rounded px-3 py-2 text-sm text-white bg-[#FC6A6A] hover:bg-[#E04F4F] cursor-pointer`}
                                                                                                                    onClick={() => {
                                                                                                                                    handleClickDelete(reading.id);
                                                                                                                                }}>
                                                                                                                <Image src={"/img/trash.svg"} width={18} height={18} alt="logo"></Image>
                                                                                                                </button>))}
                                                                                            {(index === 0 && isEditing) ? "-" : formatMoney.format(reading.totalCharge)}
                                                </td>
                                                
                                                {/* <td className="text-center">{reading.notes}</td> */}
                                            </tr>

                                            {/* 2. Unified Notes Row (Styled as the bottom of the card) */}
                                                <tr className="">
                                                    <td colSpan={8} className="text-left text-xs text-gray-500 px-6 py-2.5 rounded-b-lg border-b-2 border-l-2 border-r-2 border-solid border-gray-200">
                                                        <span className="font-semibold text-gray-700 mr-2">Notes:</span>
                                                        {(isEditing && index === 0) ? <input className="p-10 w-full mt-2" type="text" value={editedReading.notes} onChange={(e)=>{
                                                                                                                                                        setEditedReading({
                                                                                                                                                            ...editedReading,
                                                                                                                                                            notes: e.target.value
                                                                                                                                                        })
                                                                                                                                                    }}></input> 
                                                                                    : reading.notes || ""}
                                                    </td>
                                                </tr>

                                                {/* 3. Optional: Separate Spacer Row (Creates the gap BETWEEN your cards) */}
                                                <tr className="h-4  !bg-transparent rowSpacer">
                                                    <td className="!p-0" colSpan={8}></td>
                                                </tr>
                                        </React.Fragment>   
                                    ))
                                
                                :   <tr>
                                        <td colSpan={8} className="text-center text-m text-gray-500 px-6 py-2.5 rounded-b-lg border-2 border-solid border-gray-200">
                                            {t("readings.errNoReadings")}
                                        </td>
                                    </tr>
                                )
                                
                            }
                        </tbody>
            </table>
        </>     
    )
    
}