import getContract from "@/app/lib/api";
import formatDate from "@/app/lib/utils";
import { read } from "fs";
import Image from "next/image";


export default async function ContractPage({params, }: { params: Promise<{clientId: number, contractId: number}>})
{
    const { clientId, contractId } = await params;

    try{
        const { contract, readings } = await getContract(clientId, contractId);
        
        console.log(readings);
        return(
            <main>
                <h1>Contract</h1>
                <h2>{contract.clientName}</h2>
                <div>
                    <h2>{contract.printerModel}</h2>
                    <Image src={contract.isColorPrinter ? "/img/color.png" : "/img/color.png"} width={25} height={25} alt="color"></Image>
                </div>
                <h2>Minimum charge: ${contract.minimumCharge}</h2>
                <h2>Black copy price: ${ contract.blackCopyPrice }</h2>
                <h2>{contract.isColorPrinter ? "Color copy price: $" + contract.colorCopyPrice : ""}</h2>
                <h2>Bill day: {contract.billDay}</h2>

                <h1>Readings</h1>
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
                            readings.map(reading => (
                                <tr key={reading.id}>
                                    <td className="text-center">{formatDate(reading.month)}</td>
                                    <td className="text-center">{reading.blackCounter}</td>
                                    <td className="text-center">{reading.blackCopiesUsed}</td>
                                    <td className="text-center">${reading.blackCharge}</td>
                                    <td className="text-center">{contract.isColorPrinter ? reading.colorCounter : "-"}</td>
                                    <td className="text-center">{contract.isColorPrinter ? reading.colorCopiesUsed : "-"}</td>
                                    <td className="text-center">{contract.isColorPrinter ? "$" + reading.colorCharge : "-"}</td>
                                    <td className="text-center">${reading.totalCharge}</td>
                                    <td className="text-center">{reading.notes}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </main>
        );
    }catch(err)
    {   console.log(err);
        return <main>ERROR!</main>
    }
    
}