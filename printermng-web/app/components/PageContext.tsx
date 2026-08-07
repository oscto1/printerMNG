"use client"

import Link from "next/link";

export type UrlItem = {
    label: string, 
    value: string
}

export default function PageContext({url, title, description}:{url: UrlItem[], title: string, description: string}){


    return(
        <>
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                    PrinterMNG
                </span>

                {url.map(location => (
                    
                    <Link className="text-xs text-gray-500 font-medium hover:text-gray-700 cursor-pointer" key={location.value} href={location.value}>
                        <span>/ {location.label}</span>
                    </Link>
                ))}

            </div>

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </>
    );
}