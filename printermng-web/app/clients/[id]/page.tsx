import { getClient } from "@/app/lib/api";
import Image from "next/image";

export default async function ClientPage({ params, }: { params: Promise<{ id: string }>})
{
    const { id } = await params;

    try{
        const { client, contracts } = await getClient(id);

        console.log(contracts);

        return(
            <main>
                <h1>{client.name}</h1>
                <h2>{client.document}</h2>
                <h2>{client.location}</h2>
                <h2>{client.phone}</h2>

                <h2>Contracts</h2>

                <table className="w-full border">
                    <thead>
                        <tr className="border-b">
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
                    <tr key={contract.id}>
                        <td className="text-center">{contract.printer.modelName}</td>
                        <td className="text-center"><Image src={contract.printer.isColorPrinter ? "/img/color.png" : "/img/black.png"} alt="Logo" width={20} height={20}></Image></td>
                        <td className="text-center">{contract.blackCopyPrice}</td>
                        <td className="text-center">{contract.printer.isColorPrinter ? contract.colorCopyPrice : "-"}</td>
                        <td className="text-center">{contract.minimumCharge}</td>
                        <td className="text-center">{contract.billDay}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                
            </main>
        );
    }catch(err)
    {
        console.log("ERROR: " + err);
        return <main>Failed to get data!</main>
    }
    
    
}