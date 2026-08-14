"use client"
import { useRouter } from "next/navigation"
import { ClientDetails } from "@/app/[locale]/types/Clients/ClientDetails";
import React from "react";
import { useTranslations } from "next-intl";

export default function ClientsTable({clients}: {clients: ClientDetails[]}){

    const router = useRouter();

    const t = useTranslations("clients");

    return(
        <table className="w-full border">

                <thead>
                    <tr className="border-b">
                        <th className="text-center p-2">{t("document")}</th>
                        <th className="text-center p-2">{t("name")}</th>
                        <th className="text-center p-2">{t("phone")}</th>
                        <th className="text-center p-2">{t("location")}</th>
                    </tr>
                </thead>

                <tbody>
                {
                    (clients.length > 0) ?
                    clients.map(client => (

                        <React.Fragment key={client.id}>
                            <tr key={client.id} className="hover:scale-101 cursor-pointer" onClick={() => {router.push(`clients/${client.id}`)}}>
                                <td className="p-2 rounded-l-lg text-center border-t-2 border-b-2 border-l-2 border-solid border-gray-200">
                                    {client.document}
                                </td>
                                <td className="p-2 text-center border-t-2 border-b-2 border-solid border-gray-200">
                                    {client.name}
                                </td>

                                <td className="p-2 text-center border-t-2 border-b-2 border-solid border-gray-200">
                                    {client.phone}
                                </td>

                                <td className="p-2 rounded-r-lg text-center border-t-2 border-b-2 border-r-2 border-solid border-gray-200">
                                    {client.location}
                                </td>
                            </tr>

                            <tr className="h-3  !bg-transparent rowSpacer">
                                <td className="!p-0" colSpan={8}></td>
                            </tr>
                        </React.Fragment>
                    ))
                    :
                    <tr>
                        <td colSpan={8} className="text-center text-m text-gray-500 px-6 py-2.5 rounded-b-lg border-2 border-solid border-gray-200">
                            {t("errNoClients")}
                        </td>
                    </tr>
                }

                </tbody>

            </table>
    )
}