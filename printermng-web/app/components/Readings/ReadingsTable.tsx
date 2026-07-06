"use client";
import React, { useState } from "react";
import { ReadingSummary } from "../../types/ReadingSummary";
import { ContractSummary } from "../../types/ContractSummary";
import { formatDate } from "../../lib/utils";
import Image from "next/image";
import { MONTHS } from "../../lib/utils";
import { CreateReading } from "@/app/types/CreateReading";


export default function ReadingsTable({ contract, readings }: {contract: ContractSummary, readings: ReadingSummary[]}){

    const edited : CreateReading = {
            contractId: contract.id,
            month: readings[0].month,
            blackCounter: readings[0].blackCounter,
            colorCounter: readings[0].colorCounter,
            notes: readings[0].notes
        }

    const [isEditing, setIsEditing] = useState(false);
    const [editedReading, setEditedReading] = useState(edited);

    // console.log(editedReading);
    const handleSaveEdited = async () => {
        if(!isEditing) return;

        console.log(editedReading);
    }

    return(
        <table className="w-full border">
                    <thead>
                        <tr className="border-b">
                            <th className="text-center p-2">Month</th>
                            <th className="text-center p-2">Black copy counter</th>
                            <th className="text-center p-2">Black copies used</th>
                            <th className="text-center p-2">Black copies charge</th>
                            <th className="text-center p-2">Color copy counter</th>
                            <th className="text-center p-2">Color copies used</th>
                            <th className="text-center p-2">Color copies charge</th>
                            <th className="text-center p-2">Total charge</th>
                            {/* <th className="text-center p-2">Notes</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {
                            readings.map((reading, index) => (
                                <React.Fragment key={reading.id}>
                                    <tr key={reading.id}>
                                        <td className="relative text-center w-30 rounded-tl-lg">
                                            {index === 0 && (
                                            <button
                                                onClick={() => {
                                                                setIsEditing(prev => !prev);

                                                                handleSaveEdited();
                                                            }}
                                                className={`absolute top-1/2 -left-10 -translate-y-1/2 rounded px-3 py-2 text-sm text-white editButton ${
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
                                        <td className="text-center">{(index === 0 && isEditing)? <input className="text-center w-25" min={0} type="number" 
                                                                                                        value={editedReading.blackCounter} 
                                                                                                        onChange={(e)=>{ 
                                                                                                            setEditedReading({
                                                                                                                ...editedReading,
                                                                                                                blackCounter: Number(e.target.value)
                                                                                                            })
                                                                                                        }}></input> 
                                                                                                    : reading.blackCounter}</td>
                                        <td className="text-center">{reading.blackCopiesUsed}</td>
                                        <td className="text-center">{(index === 0 && isEditing) ? "-" : "$"+reading.blackCharge}</td>
                                        <td className="text-center">{(!contract.isColorPrinter) ? " -" : (index === 0 && isEditing) ? <input className="text-center" min={0} type="number" value={editedReading.colorCounter}
                                                                                                                                            onChange={(e)=>{
                                                                                                                                                setEditedReading({
                                                                                                                                                    ...editedReading,
                                                                                                                                                    colorCounter: Number(e.target.value)
                                                                                                                                                })
                                                                                                                                            }}></input>
                                                                                                                                    : reading.colorCounter}</td>
                                        <td className="text-center">{contract.isColorPrinter ? reading.colorCopiesUsed : "-"}</td>
                                        <td className="text-center">{(!contract.isColorPrinter || (index === 0 && isEditing)) ? "-" : "$" + reading.colorCharge}</td>
                                        <td className="text-center rounded-tr-lg">{(index === 0 && isEditing) ? "-" : "$"+reading.totalCharge}</td>
                                        
                                        {/* <td className="text-center">{reading.notes}</td> */}
                                    </tr>

                                    {/* 2. Unified Notes Row (Styled as the bottom of the card) */}
                                        <tr className="shadow-md shadow-gray-300">
                                            <td colSpan={8} className="text-left text-xs text-gray-500 px-6 py-2.5 rounded-b-lg">
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
                        }
                    </tbody>
        </table>
    )
    
}