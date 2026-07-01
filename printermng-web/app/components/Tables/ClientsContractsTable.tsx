"use client";
import { useRouter } from "next/navigation";
import { ContractDetails } from "@/app/types/ContractDetails";
import Image from "next/image";

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
                                <th className="text-center p-2">Minimum charge</th>
                                <th className="text-center p-2">Bill day</th>
                            </tr>
                        </thead>
                
                    <tbody>
                        {contracts.map(contract => (
                            
                        <tr className="hover:scale-101 cursor-pointer" key={contract.id} onClick={() => {router.push(`/clients/${clientId}/contracts/${contract.id}`)}}>
                            <td className={`text-center text-white align-middle ${contract.isActive ? "!bg-[#85ED4C]" : "!bg-[#ED544C]"} w-25`}>{contract.isActive ? "Active" : "Inactive"}</td>
                            <td className="text-center align-middle">{contract.printer.modelName}</td>
                            <td className="text-center align-middle"><Image src={contract.printer.isColorPrinter ? "/img/color.png" : "/img/black.png"} alt="Logo" width={20} height={20}></Image></td>
                            <td className="text-center align-middle">${contract.blackCopyPrice}</td>
                            <td className="text-center align-middle">{contract.printer.isColorPrinter ? "$"+contract.colorCopyPrice : "-"}</td>
                            <td className="text-center align-middle">${contract.minimumCharge}</td>
                            <td className="text-center align-middle">{contract.billDay}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
    );
}

