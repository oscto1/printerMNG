import { getContract } from "@/app/lib/api";
import { formatMoney } from "@/app/lib/utils";
import ReadingsTable from "@/app/components/Tables/ReadingsTable";
import ReadingsActions from "@/app/components/Actions/ReadingsActions";
import PageContext, { UrlItem } from "@/app/components/PageContext";
import Header, {HeaderRightItem} from "@/app/components/Header";
import DeleteContractAction from "@/app/components/Actions/Contracts/DeleteContractAction";
import EditContractAction from "@/app/components/Actions/Contracts/EditContractAction";

export default async function ContractPage({params, }: { params: Promise<{clientId: number, contractId: number}>})
{
    const { clientId, contractId } = await params;

    
    try{
        const { contract, readings } = await getContract(clientId, contractId);
        
        const url : UrlItem[] = [
            {label: "Clients", value: "/clients"},
            {label: contract.clientName, value: `/clients/${clientId}`},
            {label: contract.printerModel, value: ``}
        ]

        const rightItems : HeaderRightItem[] = [
            {bgColor: (contract.isActive ? "#94FF97" : "#FD8B8B"), text: (contract.isActive ? "Active" : "Inactive")},
            {imgUrl: contract.isColorPrinter ? "/img/color.png" : "/img/black.png", text: contract.printerModel},
        ]

        const currentContractData = {
            clientId: clientId,
            printerId: -1,
            isActive: contract.isActive,
            minimumCharge: contract.minimumCharge,
            blackCopyPrice: contract.blackCopyPrice,
            colorCopyPrice: contract.colorCopyPrice,
            startDate: contract.startDate,
            billDay: contract.billDay
        }

        return(
            <main className="w-full mx-auto px-4 py-8 space-y-6">
                
                <PageContext url={url} title="Contract" description=""></PageContext>

                <div className="flex gap-2">
                    <EditContractAction contractId={contract.id} currentContractData={currentContractData}></EditContractAction>
                    <DeleteContractAction contractId={contract.id}></DeleteContractAction>
                </div>

                <Header title={`${contract.clientName}`} 
                        leftData={[
                            `Fixed charge: ${formatMoney.format(contract.minimumCharge)}`,
                            `Black copy price: ${formatMoney.format(contract.blackCopyPrice)}`,
                            contract.isColorPrinter ? "Color copy price: " + formatMoney.format(contract.colorCopyPrice) : "",
                            `Bill day: ${contract.billDay}`
                            ]}
                        rightItems={rightItems}>
                </Header>

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Readings</h2>
                    <ReadingsActions contractId={contract.id}></ReadingsActions>
                </div>
                <ReadingsTable contract={contract} readings={readings}></ReadingsTable>
            </main>
        );
    }catch(err)
    {   console.log(err);
        return <main>ERROR!</main>
    }
    
}