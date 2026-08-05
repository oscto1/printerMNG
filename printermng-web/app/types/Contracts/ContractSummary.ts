export interface ContractSummary
{
    id: number,
    idClient: number,
    clientName: string,
    printerModel: string,
    isColorPrinter: boolean,
    isActive: boolean,
    blackCopyPrice: number,
    colorCopyPrice: number,
    minimumCharge: number,
    startDate: string,
    billDay: number
}