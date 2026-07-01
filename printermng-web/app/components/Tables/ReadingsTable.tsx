"use client";
import { useState } from "react";
import { ReadingSummary } from "../../types/ReadingSummary";
import { ContractSummary } from "../../types/ContractSummary";
import formatDate from "../../lib/utils";
import Image from "next/image";
import { MONTHS } from "../../lib/utils";

export default function ReadingsTable({ contract, readings }: {contract: ContractSummary, readings: ReadingSummary[]}){

    const [isEditing, setIsEditing] = useState(false);
    const [editedReading, setEditedReading] = useState(readings[0]);

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
                            <th className="text-center p-2">Notes</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            readings.map((reading, index) => (

                                <tr key={reading.id}>
                                    <td className="relative text-center w-30">
                                        {index === 0 && (
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`absolute top-1/2 -left-10 -translate-y-1/2 rounded px-3 py-2 text-sm text-white editButton ${
                                                isEditing ? 'bg-[#7AE972] hover:bg-[#4ECF44]' : 'bg-[#3DA1E3] hover:bg-[#1A78B7]'
                                            }`}
                                        >
                                            <Image src={isEditing ? "/img/save.svg" : "/img/edit.svg"} width={20} height={20} alt="logo"></Image>
                                        </button>
                                        )}

                                        {(index === 0 && isEditing) ? 
                                            
                                            <div>
                                                <select name="MONTH" id="month" defaultValue={Number(reading.month.split("-")[1]) - 1}>{MONTHS.map((option, index) => (<option key={index} value={index} >{option}</option>))}</select>
                                                <input className="text-center w-20" type="number" min={1900} placeholder={reading.month.split("-")[0]}/>
                                            </div>
                                            
                                            : formatDate(reading.month)}
                                    </td>

                                    {/* <td className="text-center">{formatDate(reading.month)}</td> */}
                                    <td className="text-center w-30">{(index === 0 && isEditing) ? <input className="text-center w-25" min={0} type="number" placeholder={reading.blackCounter.toFixed()}></input> : reading.blackCounter}</td>
                                    <td className="text-center">{reading.blackCopiesUsed}</td>
                                    <td className="text-center">{(index === 0 && isEditing) ? "-" : "$"+reading.blackCharge}</td>
                                    <td className="text-center">{(!contract.isColorPrinter) ? " -" : (index === 0 && isEditing) ? <input className="text-center" min={0} type="number" placeholder={reading.colorCounter.toFixed()}></input> : reading.colorCounter}</td>
                                    <td className="text-center">{contract.isColorPrinter ? reading.colorCopiesUsed : "-"}</td>
                                    <td className="text-center">{(!contract.isColorPrinter || (index === 0 && isEditing)) ? "-" : "$" + reading.colorCharge}</td>
                                    <td className="text-center">{(index === 0 && isEditing) ? "-" : "$"+reading.totalCharge}</td>
                                    <td className="text-center">{reading.notes}</td>
                                </tr>

                            ))
                        }
                    </tbody>
        </table>
    )
    
}