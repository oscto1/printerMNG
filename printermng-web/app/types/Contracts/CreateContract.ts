export interface CreateContract{
    clientId: number,
    printerId: number,
    pdfPath: string,
    blackCopyPrice: number,
    colorCopyPrice: number,
    minimumCharge: number,
    startDate: string,
    billDay: number
}