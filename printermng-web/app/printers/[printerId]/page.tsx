
import PageContext from "@/app/components/PageContext";
import { UrlItem } from "@/app/components/PageContext";
import { getPrinter, getBrands } from "@/app/lib/api";
import { PrinterDetails } from "@/app/types/Printers/PrinterDetails";
import Header from "@/app/components/Header";
import EditPrinterAction from "@/app/components/Actions/Printers/EditPrinterAction";
import DeletePrinterAction from "@/app/components/Actions/Printers/DeletePrinterAction";
import Navbar from "@/app/components/Navbar";

export default async function PrinterPage({params}: {params: Promise<{printerId: number}>}){
    
    try{
        const { printerId } = await params;

        const printer : PrinterDetails = await getPrinter(printerId);

        const brands = await getBrands();

        const url : UrlItem[] = [
            {label: "Printers", value: "/printers"},
            {label: printer.modelName, value: `/printers/${printer.id}`}
        ]

        return(
            <main className="w-full mx-auto px-4 py-8 space-y-6">
                <Navbar></Navbar>
                <PageContext title="Printer Overview" url={url} description=""></PageContext>

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