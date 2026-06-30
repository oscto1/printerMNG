export interface ReadingSummary
{
    id: number,
    month: string,
    blackCounter: number,
    colorCounter: number,
    blackCopiesUsed: number,
    colorCopiesUsed: number,
    blackCharge: number,
    colorCharge: number,
    totalCharge: number,
    notes: string
}