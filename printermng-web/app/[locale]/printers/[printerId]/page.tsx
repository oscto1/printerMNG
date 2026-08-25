
import PageContext from "@/app/[locale]/components/PageContext";
import { UrlItem } from "@/app/[locale]/components/PageContext";
import { AppErrorCode, CustomApiError, getBrands } from "@/app/[locale]/lib/api";
import { getPrinter } from "../../lib/apiServer";
import { PrinterDetails } from "@/app/[locale]/types/Printers/PrinterDetails";
import Header from "@/app/[locale]/components/Header";
import EditPrinterAction from "@/app/[locale]/components/Actions/Printers/EditPrinterAction";
import DeletePrinterAction from "@/app/[locale]/components/Actions/Printers/DeletePrinterAction";
import Navbar from "@/app/[locale]/components/Navbar";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function PrinterPage({params}: {params: Promise<{printerId: number}>}){
    const t = await getTranslations();
    try{
        const { printerId } = await params;

        const printer : PrinterDetails = await getPrinter(printerId);

        const brands = await getBrands();

        const url : UrlItem[] = [
            {label: `${t("printers.title")}`, value: "/printers"},
            {label: printer.modelName, value: `/printers/${printer.id}`}
        ]

        return(
            <main className="w-full mx-auto px-4 py-8 space-y-6">
                <Navbar></Navbar>
                <PageContext title={t("printers.printerOverview")} url={url} description={t("printers.singlePrinterDescription")}></PageContext>

                <div className="flex gap-2">
                    <EditPrinterAction currentPrinter={printer} brands={brands}></EditPrinterAction>
                    <DeletePrinterAction printerId={printer.id}></DeletePrinterAction>
                </div>
                
                <Header title={brands.findLast(brand => brand.id === printer.brandId)?.name + " " + printer.modelName} rightItems={[
                    {imgUrl: (printer.isColorPrinter ? "/img/color.png" : "/img/black.png"), text: ((printer.isColorPrinter ? "Color printer" : "B&W printer"))}
                ]}></Header>
                
            </main>
        )
    }catch(err){
        if(err instanceof CustomApiError){
            if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                redirect("/auth/login");
            }
        }else{
            return(t("SERVER_ERROR"));
        }
    }

    
}