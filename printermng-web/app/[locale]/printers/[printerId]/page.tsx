
import PageContext from "@/app/[locale]/components/PageContext";
import { UrlItem } from "@/app/[locale]/components/PageContext";
import { getPrinter, getBrands } from "@/app/[locale]/lib/api";
import { PrinterDetails } from "@/app/[locale]/types/Printers/PrinterDetails";
import Header from "@/app/[locale]/components/Header";
import EditPrinterAction from "@/app/[locale]/components/Actions/Printers/EditPrinterAction";
import DeletePrinterAction from "@/app/[locale]/components/Actions/Printers/DeletePrinterAction";
import Navbar from "@/app/[locale]/components/Navbar";
import { getTranslations } from "next-intl/server";

export default async function PrinterPage({params}: {params: Promise<{printerId: number}>}){
    
    try{
        const { printerId } = await params;

        const printer : PrinterDetails = await getPrinter(printerId);

        const t = await getTranslations();

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
        console.log(err);
        //REDIRECT
    }

    
}