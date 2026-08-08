"use client"

import Image from "next/image"

export type HeaderRightItem = {
    bgColor?: string,
    imgUrl?: string,
    text: string
}

export default function Header({title, leftData, rightItems}: {title: string, leftData?: string[], rightItems?: HeaderRightItem[]}){
    return(
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left */}
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>

                    {leftData?.map((item, index) => (
                        <p key={index} className="text-sm text-gray-500">
                            {item}
                        </p>
                    ))}
                </div>
                
                {/* Right items */}
                <div className="flex flex-wrap items-center mb-auto gap-3 text-sm text-gray-600">
                    {
                        rightItems?.map((item, index) => (
                            <div key={index} className={`flex items-center gap-2 bg-${(item.bgColor !== undefined ? "["+item.bgColor+"]" : "gray-50")} px-3 py-2 rounded-lg border border-gray-100 shadow-2xs`}>
                                {item.imgUrl !== null && item.imgUrl !== undefined  ? <Image src={item.imgUrl} alt={"icon"+index} width={15} height={15}></Image> : ""}
                                
                                <span className="font-medium text-gray-700">{item.text}</span>
                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
    )
}