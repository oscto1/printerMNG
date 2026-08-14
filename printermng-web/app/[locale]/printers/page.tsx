"use client"

import PageContext, { UrlItem } from "../components/PageContext"
import { useEffect, useState } from "react"
import { PrinterSummary } from "../types/Printers/PrinterSummary";
import { getPrinters, getBrands } from "../lib/api";
import { useError } from "../context/ErrorContext";
import { Brand } from "../types/Printers/Brand";
import PrintersTable from "../components/Tables/PrintersTable";
import CreatePrinterAction from "../components/Actions/Printers/CreatePrinterAction";
import Navbar from "../components/Navbar";
import { useTranslations } from "next-intl";

export default function PrintersPage(){
    const t = useTranslations("printers");

    const url : UrlItem[] = [
        {label: `${t("title")}`, value: "/printers"}
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
                    showError(err);
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
}