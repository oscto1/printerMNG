"use client"

import PageContext, { UrlItem } from "../components/PageContext"
import { useEffect, useState } from "react"
import { PrinterSummary } from "../types/Printers/PrinterSummary";
import { getPrinters, getBrands } from "../lib/apiRequests";
import { CustomApiError, AppErrorCode } from "../lib/apiUtils";
import { useError } from "../context/ErrorContext";
import { Brand } from "../types/Printers/Brand";
import PrintersTable from "../components/Tables/PrintersTable";
import CreatePrinterAction from "../components/Actions/Printers/CreatePrinterAction";
import Navbar from "../components/Navbar";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

export default function PrintersPage(){
    const router = useRouter();
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(true);
    
    const url : UrlItem[] = [
            {label: `${t("printers.title")}`, value: "/printers"}
        ]

    const [printerList, setPrinterList] = useState([] as PrinterSummary[]);
    const [brandList, setBrandList] = useState([] as Brand[]);

    const [ serverError, setServerError ] = useState(false);

    const { showError } = useError();
    
    useEffect(() => {
            const handleGetPrinters = async () => {
                try {
                    const [ brands, printers ] = await Promise.all([getBrands(), getPrinters()]);
                    // const brands = await getBrands();
                    // const printers = await getPrinters();
                    setBrandList(brands);
                    setPrinterList(printers);
                } catch (err) {
                    
                    if(err instanceof CustomApiError){
                        if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                            router.push("/auth/login");
                        }else{
                            showError(err);
                        }
                    }else{
                        console.error(err);
                        setServerError(true);
                    }
                }finally{
                    setIsLoading(false);
                }
            };
    
            handleGetPrinters();
    
    }, []);

    if(isLoading) return <Loading />
    if(serverError) return <main className="w-full mx-auto px-4 py-8 space-y-6"><p>{t("errors.SERVER_ERROR")}</p></main>
    return(
        <main className="w-full mx-auto px-4 py-8 space-y-6">
            <Navbar></Navbar>
            <PageContext url={url} title={t("printers.title")} description={t("printers.description")}></PageContext>

            <CreatePrinterAction brands={brandList}></CreatePrinterAction>
            <PrintersTable printers={printerList}></PrintersTable>
        </main>
        
    );
}