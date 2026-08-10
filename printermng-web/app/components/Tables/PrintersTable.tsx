
import { PrinterSummary } from "@/app/types/Printers/PrinterSummary";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PrintersTable({printers}: {printers: PrinterSummary[]}){

    const router = useRouter();
    return(
        <table className="w-full border">
            <thead>
                <tr className="border-b">
                    <th className="text-center p-2">Brand</th>
                    <th className="text-center p-2">Name</th>
                    <th className="text-center p-2">Color</th>
                </tr>
            </thead>

            <tbody>
            {
                (printers.length > 0) ?
                printers.map(printer => (

                    <React.Fragment key={printer.id}>
                        <tr key={printer.id} className="hover:scale-101 cursor-pointer" onClick={() => {router.push(`printers/${printer.id}`)}}>
                            <td className="p-2 rounded-l-lg text-center border-t-2 border-b-2 border-l-2 border-solid border-gray-200">
                                {printer.brand}
                            </td>
                            <td className="p-2 text-center border-t-2 border-b-2 border-solid border-gray-200">
                                {printer.modelName}
                            </td>
                            <td className="text-center rounded-r-lg border-t-2 border-b-2 border-r-2 border-solid border-gray-200 align-middle"><Image className="d-block mx-auto" src={printer.isColorPrinter ? "/img/color.png" : "/img/black.png"} alt="Logo" width={20} height={20}></Image></td>
                        </tr>

                        <tr className="h-3  !bg-transparent rowSpacer">
                            <td className="!p-0" colSpan={8}></td>
                        </tr>
                    </React.Fragment>
                ))
                :
                <tr>
                    <td colSpan={8} className="text-center text-m text-gray-500 px-6 py-2.5 rounded-b-lg border-2 border-solid border-gray-200">
                        There are no printers yet
                    </td>
                </tr>
            }

            </tbody>

        </table>
    );
}