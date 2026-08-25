import { AppErrorCode, CustomApiError } from "@/app/[locale]/lib/api";
import { getContract } from "@/app/[locale]/lib/apiServer";
import { formatMoney } from "@/app/[locale]/lib/utils";
import ReadingsTable from "@/app/[locale]/components/Tables/ReadingsTable";
import ReadingsActions from "@/app/[locale]/components/Actions/ReadingsActions";
import PageContext, { UrlItem } from "@/app/[locale]/components/PageContext";
import Header, {HeaderRightItem} from "@/app/[locale]/components/Header";
import DeleteContractAction from "@/app/[locale]/components/Actions/Contracts/DeleteContractAction";
import EditContractAction from "@/app/[locale]/components/Actions/Contracts/EditContractAction";
import Navbar from "@/app/[locale]/components/Navbar";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function ContractPage({params, }: { params: Promise<{clientId: number, contractId: number}>})
{
    const t = await getTranslations();
    try{

        const { clientId, contractId } = await params;
        const { contract, readings } = await getContract(clientId, contractId);
        

        const url : UrlItem[] = [
            {label: t("common.clients"), value: "/clients"},
            {label: contract.clientName, value: `/clients/${clientId}`},
            {label: t("common.contract"), value: `/clients/${clientId}`},
            {label: contract.printerModel, value: ``}
        ]

        const rightItems : HeaderRightItem[] = [
            {bgColor: (contract.isActive ? "#94FF97" : "#FD8B8B"), text: (contract.isActive ? t("common.active") : t("common.inactive"))},
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
                <Navbar></Navbar>

                <PageContext url={url} title={t("contracts.contractOverview")} description={t("contracts.description")}></PageContext>

                <div className="flex gap-2">
                    <EditContractAction contractId={contract.id} currentContractData={currentContractData}></EditContractAction>
                    <DeleteContractAction clientId={clientId} contractId={contract.id}></DeleteContractAction>
                </div>

                <Header title={`${contract.clientName}`} 
                        leftData={[
                            `${t("contracts.fixedCharge")}: ${formatMoney.format(contract.minimumCharge)}`,
                            `${t("contracts.blackPrice")} ${formatMoney.format(contract.blackCopyPrice)}`,
                            contract.isColorPrinter ? `${t("contracts.colorPrice")}: ` + formatMoney.format(contract.colorCopyPrice) : "",
                            `${t("contracts.billDay")}: ${contract.billDay}`
                            ]}
                        rightItems={rightItems}>
                </Header>

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t("readings.title")}</h2>
                    <ReadingsActions contractId={contract.id} contractIsActive={contract.isActive}></ReadingsActions>
                </div>
                <ReadingsTable contract={contract} readings={readings}></ReadingsTable>
            </main>
        );
    }catch(err){
        if(err instanceof CustomApiError && err.data.includes("UNAUTHORIZED" as AppErrorCode)){
            redirect("/auth/login");
        }else{
            //
            return(t("SERVER_ERROR"));
        }
    }
    
}