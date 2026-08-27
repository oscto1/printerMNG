'use client'

import PageContext from "@/app/[locale]/components/PageContext";
import { UrlItem } from "@/app/[locale]/components/PageContext";
import { AppErrorCode, CustomApiError } from "@/app/[locale]/lib/apiUtils";
import { getBrands } from "../../lib/apiRequests";
import { getPrinter } from "../../lib/apiRequests";
import { PrinterDetails } from "@/app/[locale]/types/Printers/PrinterDetails";
import Header from "@/app/[locale]/components/Header";
import EditPrinterAction from "@/app/[locale]/components/Actions/Printers/EditPrinterAction";
import DeletePrinterAction from "@/app/[locale]/components/Actions/Printers/DeletePrinterAction";
import Navbar from "@/app/[locale]/components/Navbar";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Brand } from "../../types/Printers/Brand";

export default function PrinterPage({params}: {params: Promise<{printerId: number}>}){
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(true);
    const { printerId } = use(params);
    const [ printer, setPrinter ] = useState<PrinterDetails>({id: -1, brandId: -1, modelName: "", isColorPrinter: false});
    const [ brands, setBrands ] = useState<Brand[]>([]);
    const [ serverError, setServerError ] = useState(false);

    const url : UrlItem[] = [
        {label: `${t("printers.title")}`, value: "/printers"},
        {label: printer.modelName, value: `/printers/${printer.id}`}
    ]

    useEffect(() => {
        const loadPrinter = async () => {
            try{
                const [printer, brands] = await Promise.all([
                    getPrinter(printerId),
                    getBrands()
                ]);

                setPrinter(printer);
                setBrands(brands);
            }catch(err){
                if(err instanceof CustomApiError){
                    if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                        redirect("/auth/login");
                    }
                }else{
                    console.error(err);
                    setServerError(true);
                }
            }finally{
                setIsLoading(false);
            }  
        }
        
        loadPrinter();
    }, [printerId]);

    if(isLoading) return <main className="w-full mx-auto px-4 py-8 space-y-6"><p>Loading...</p></main>
    if(serverError) return <main className="w-full mx-auto px-4 py-8 space-y-6"><p>{t("errors.SERVER_ERROR")}</p></main>
    return(
        
        <main className="w-full mx-auto px-4 py-8 space-y-6">
            <Navbar></Navbar>
            <PageContext title={t("printers.printerOverview")} url={url} description={t("printers.singlePrinterDescription")}></PageContext>

            <div className="flex gap-2">
                <EditPrinterAction currentPrinter={printer} brands={brands}></EditPrinterAction>
                <DeletePrinterAction printerId={printer.id}></DeletePrinterAction>
            </div>
            
            <Header title={brands.findLast(brand => brand.id === printer.brandId)?.name + " " + printer.modelName} rightItems={[
                {imgUrl: (printer.isColorPrinter ? "/img/color.png" : "/img/black.png"), text: ((printer.isColorPrinter ? "Color printer" : "B & W printer"))}
            ]}></Header>
            
        </main>
    ); 
}