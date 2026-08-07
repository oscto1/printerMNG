"use client";
import { useRouter } from "next/navigation";
import { ContractDetails } from "@/app/types/Contracts/ContractDetails";
import Image from "next/image";
import { formatMoney } from "@/app/lib/utils";
import React from "react";

export default function ClientsContractsTable({clientId, contracts}: {clientId: number, contracts: ContractDetails[]})
{
    const router = useRouter();

    return(
        <table className="w-full border">
                        <thead>
                            <tr className="border-b">
                                <th></th>
                                <th className="text-center p-2">Printer</th>
                                <th className="text-center p-2">Color</th>
                                <th className="text-center p-2">Black copy price</th>
                                <th className="text-center p-2">Color copy price</th>
                                <th className="text-center p-2">Fixed charge</th>
                                <th className="text-center p-2">Bill day</th>
                            </tr>
                        </thead>
                
                    <tbody>
                        {contracts.map(contract => (
                            
                        <React.Fragment key={contract.id}>
                            <tr className="hover:scale-101 cursor-pointer" key={contract.id} onClick={() => {router.push(`/clients/${clientId}/contracts/${contract.id}`)}}>
                                <td className={`text-center text-white border-t-2 border-b-2 border-l-2 border-solid border-gray-200 rounded-l-lg align-middle ${contract.isActive ? "!bg-[#85ED4C]" : "!bg-[#ED544C]"} w-25`}>{contract.isActive ? "Active" : "Inactive"}</td>
                                <td className="text-center border-t-2 border-b-2 border-solid border-gray-200 align-middle">{contract.printer.modelName}</td>
                                <td className="text-center border-t-2 border-b-2 border-solid border-gray-200 align-middle"><Image className="d-block mx-auto" src={contract.printer.isColorPrinter ? "/img/color.png" : "/img/black.png"} alt="Logo" width={20} height={20}></Image></td>
                                <td className="text-center border-t-2 border-b-2 border-solid border-gray-200 align-middle">{formatMoney.format(contract.blackCopyPrice)}</td>
                                <td className="text-center border-t-2 border-b-2 border-solid border-gray-200 align-middle">{contract.printer.isColorPrinter ? formatMoney.format(contract.colorCopyPrice) : "-"}</td>
                                <td className="text-center border-t-2 border-b-2 border-solid border-gray-200 align-middle">{formatMoney.format(contract.minimumCharge)}</td>
                                <td className="text-center border-t-2 border-b-2 border-solid border-r-2 border-gray-200 align-middle rounded-r-lg">{contract.billDay}</td>
                            </tr>

                            <tr className="h-4  !bg-transparent rowSpacer">
                                <td className="!p-0" colSpan={8}></td>
                            </tr>
                        </React.Fragment>
                        
                        ))}
                    </tbody>
                    </table>
    );
}

