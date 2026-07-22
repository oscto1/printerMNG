import { getContract } from "@/app/lib/api";
import Image from "next/image";
import { formatMoney } from "@/app/lib/utils";
import ReadingsTable from "@/app/components/Readings/ReadingsTable";
import ReadingsActions from "@/app/components/Readings/ReadingsActions";

export default async function ContractPage({params, }: { params: Promise<{clientId: number, contractId: number}>})
{
    const { clientId, contractId } = await params;

    try{
        const { contract, readings } = await getContract(clientId, contractId);
        
        return(
            <main>
                <h1>Contract</h1>
                <h2>{contract.clientName}</h2>
                <div>
                    <h2>{contract.printerModel}</h2>
                    <Image src={contract.isColorPrinter ? "/img/color.png" : "/img/color.png"} width={25} height={25} alt="color"></Image>
                </div>
                <h2>Minimum charge: {formatMoney.format(contract.minimumCharge)}</h2>
                <h2>Black copy price: {formatMoney.format(contract.blackCopyPrice)}</h2>
                <h2>{contract.isColorPrinter ? "Color copy price: " + formatMoney.format(contract.colorCopyPrice) : ""}</h2>
                <h2>Bill day: {contract.billDay}</h2>

                <h1>Readings</h1>

                <ReadingsActions contractId={contract.id}></ReadingsActions>
                <ReadingsTable contract={contract} readings={readings}></ReadingsTable>
            </main>
        );
    }catch(err)
    {   console.log(err);
        return <main>ERROR!</main>
    }
    
}