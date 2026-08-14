export interface EditContract{
    clientId: number,
    printerId: number,
    pdfPath?: string,
    isActive: boolean,
    minimumCharge: number,
    blackCopyPrice: number,
    colorCopyPrice: number,
    startDate: string,
    billDay: number
}