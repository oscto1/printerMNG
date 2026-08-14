import { PrinterDetails } from "../Printers/PrinterDetails"

export interface ContractDetails
{
    id: number,
    clientId: number,
    isActive: boolean,
    printer: PrinterDetails,
    blackCopyPrice: number,
    colorCopyPrice: number,
    minimumCharge: number,
    billDay: number
}