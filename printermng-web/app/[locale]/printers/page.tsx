"use client"

import PageContext, { UrlItem } from "../components/PageContext"
import { useEffect, useState } from "react"
import { PrinterSummary } from "../types/Printers/PrinterSummary";
import { getPrinters, getBrands, AppErrorCode, CustomApiError } from "../lib/api";
import { useError } from "../context/ErrorContext";
import { Brand } from "../types/Printers/Brand";
import PrintersTable from "../components/Tables/PrintersTable";
import CreatePrinterAction from "../components/Actions/Printers/CreatePrinterAction";
import Navbar from "../components/Navbar";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function PrintersPage(){
    const router = useRouter();
    const t = useTranslations();
    try{
        

        const url : UrlItem[] = [
            {label: `${t("printers.title")}`, value: "/printers"}
        ]

        const [printerList, setPrinterList] = useState([] as PrinterSummary[]);
        const [brandList, setBrandList] = useState([] as Brand[]);

        const { showError } = useError();
        
        useEffect(() => {
                const handleGetPrinters = async () => {
                    try {
                        const brands = await getBrands();
                        const printers = await getPrinters();
                        setBrandList(brands);
                        setPrinterList(printers);
                    } catch (err) {
                        if(err instanceof CustomApiError){
                            if(err.data.includes("UNAUTHORIZED" as AppErrorCode)){
                                router.push("/auth/login");
                            }else{
                                showError(err);
                            }
                        }
                    }
                };
        
                handleGetPrinters();
        
            }, []);

        return(
            <main className="w-full mx-auto px-4 py-8 space-y-6">
                <Navbar></Navbar>
                <PageContext url={url} title={t("title")} description={t("description")}></PageContext>

                <CreatePrinterAction brands={brandList}></CreatePrinterAction>
                <PrintersTable printers={printerList}></PrintersTable>
            </main>
            
        )
    }catch(err){
        if(err instanceof CustomApiError){
            if(JSON.parse(err.message).includes("UNAUTHORIZED" as AppErrorCode)){
                router.push("/auth/login");
            }
        }
        else{
            return(t("SERVER_ERROR"));
        }
    }
    
}