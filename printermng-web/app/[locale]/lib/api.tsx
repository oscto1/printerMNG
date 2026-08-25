import { ContractSummary } from "../types/Contracts/ContractSummary";
import { CreateReading } from "../types/Readings/CreateReading";
import { ReadingSummary } from "../types/Readings/ReadingSummary";
import { CreateClient } from "../types/Clients/CreateClient";
import { PrinterSummary } from "../types/Printers/PrinterSummary";
import { CreateContract } from "../types/Contracts/CreateContract";
import { EditClient } from "../types/Clients/EditClient";
import { EditContract } from "../types/Contracts/EditContract";
import { EditReading } from "../types/Readings/EditReading";
import { Brand } from "../types/Printers/Brand";
import { CreatePrinter } from "../types/Printers/CreatePrinter";
import { EditPrinter } from "../types/Printers/EditPrinter";
import { Credentials } from "../types/Auth/Login";

export const API_URL = "http://localhost:5280"



// export async function getContract(idClient: number, idContract: number): Promise<{contract: ContractSummary; readings: ReadingSummary[];}>{
//     const contractResponse = await fetch(`${API_URL}/contracts/${idContract}`, { credentials: "include" });
//     const readingsResponse = await fetch(`${API_URL}/contracts/${idContract}/readings`, { credentials: "include" });

//     if(!contractResponse.ok)
//     {
//         const errList = await getErrorMessage(readingsResponse);

//         throw new CustomApiError(errList, "Failed to fetch contract details.");
//     }

//     if(!readingsResponse.ok)
//     {
//         const errList = await getErrorMessage(readingsResponse);

//         throw new CustomApiError(errList, "Failed to fetch readings for this contract.");
//     }

//     const contractSummary : ContractSummary = await contractResponse.json();
//     const readingsList : ReadingSummary[] = await readingsResponse.json();

//     return{
//         contract: contractSummary,
//         readings: readingsList
//     }
// }

export async function editPrinter(printerId: number, printer: EditPrinter){

    const response = await fetch(`${API_URL}/printers/${printerId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(printer)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to edit printer.");
    }
}

export async function deletePrinter(printerId: number){
    const response = await fetch(`${API_URL}/printers/${printerId}`, {
        credentials: "include",
        method: "DELETE"
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to delete printer.");
    }
}

export async function createReading(newReading: CreateReading){
    const response = await fetch(`${API_URL}/monthly-readings`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newReading)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to create printer.");
    }

}

export async function editReading(contractId: number, readingId: number, reading: EditReading){
    const response = await fetch(`${API_URL}/contracts/${contractId}/readings/${readingId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reading)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to edit reading.");
    }
}   

export async function deleteReading(contractId: number, readingId: number){
    const response = await fetch(`${API_URL}/contracts/${contractId}/readings/${readingId}`, {
        credentials: "include",
        method: "DELETE"
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to delete reading.");
    }
}

export async function createClient(newClient: CreateClient){
    const response = await fetch(`${API_URL}/clients`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newClient)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to create client.");
    }
}

export async function editClient(clientId: number, editedClient: EditClient){
    const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editedClient)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to edit client.");
    }
}

export async function deleteClient(clientId: number){
    const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to delete client.");
    }
}

export async function getBrands(): Promise<Brand[]>{
    const response = await fetch(`${API_URL}/brands`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to get brands.");
    }

    return response.json();
}

export async function getPrinters(): Promise<PrinterSummary[]>{
    const response = await fetch(`${API_URL}/printers`, {
        credentials: "include"
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to get printers.");
    }

    return response.json();
}

export async function createPrinter(newPrinter: CreatePrinter){
    const response = await fetch(`${API_URL}/printers`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPrinter)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to create printer");
    }
}

export async function createContract(newContract: CreateContract){
    const response = await fetch(`${API_URL}/contracts`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContract)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to create contract.");
    }
}

export async function deleteContract(contractId: number){
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
        credentials: "include",
        method: "DELETE",
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to delete contract.");
    }
}

export async function editContract(contractId: number, contract: EditContract){
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contract)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to edit contract.");
    }
}


export async function login(credentials: Credentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to login.");
    }

}

export async function register(credentials: Credentials){
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if(!response.ok)
    {
        const clonedResponse = response.clone();
        const errList = await getErrorMessage(clonedResponse);

        throw new CustomApiError(errList, "Failed to register.");
        // throw new Error(JSON.stringify(errorCodes));
    }
}

export const APP_ERROR_CODES = [
    // .NET Identity codes
    "DuplicateUserName",
    "DuplicateEmail",
    "InvalidEmail",
    "PasswordTooShort",
    "PasswordRequiresDigit",
    "PasswordRequiresUpper",
    // Generic codes
    "UNAUTHORIZED",
    "NOT_FOUND",
    "SERVER_ERROR",
    "EMPTY_RESPONSE",
    "PARSE_ERROR",
    "UNKNOWN_ERROR",
    // Validation Errors
    "INVALID_PRINTER_ID",
    "INVALID_BRANDID",
    "INVALID_MODELNAME",
    "UPDATE_PRINTER_HAS_CONTRACTS",
    "DELETE_PRINTER_HAS_CONTRACTS",
    "INVALID_CLIENT_DOCUMENT",
    "INVALID_CLIENT_NAME",
    "INVALID_CLIENT_PHONE",
    "INVALID_CLIENT_LOCATION",
    "DELETE_CLIENT_HAS_CONTRACTS",
    "INVALID_PRINTER_ID",
    "INVALID_B_COPY_PRICE",
    "INVALID_C_COPY_PRICE",
    "INVALID_MINIMUM_CHARGE",
    "CLIENT_NOT_FOUND",
    "PRINTER_NOT_FOUND",
    "CONTRACT_NOT_FOUND",
    "CONTRACT_NOT_ACTIVE",
    "ONLY_LAST_READING_CAN_BE_DELETED",
    "DATE_READING_INVALID",
    "BLACK_COUNTER_READING_INVALID",
    "COLOR_COUNTER_READING_INVALID",
    "COULD_NOT_UPDATE_READING_IN",
    "COULD_NOT_UPDATE_READING",
    "INVALID_MONTH_FORMAT",
    "INVALID_BLACK_COUNTER",
    "INVALID_COLOR_COUNTER",
    "INVALID_NOTES"
] as const;

export type AppErrorCode = typeof APP_ERROR_CODES[number];

export function isAppErrorCode(value: unknown): value is AppErrorCode {
  return (
    typeof value === "string" &&
    APP_ERROR_CODES.includes(value as AppErrorCode)
  );
}

function getErrors(body: any) : AppErrorCode[] {
    var errorList: AppErrorCode[] = [];

    if(!body) return [];
    
    // .NET Identity
    if(Array.isArray(body)){
        return body.map(err => err?.code)
                    .filter((code): code is AppErrorCode => !!code);
    }

    // Validation / Api errors
    if (body["errors"]) {
        const errorsPayload = body["errors"];
        if (typeof errorsPayload === 'object' && !Array.isArray(errorsPayload)) {
    
            // return Object.keys(errorsPayload).map(field => `INVALID_${field.toUpperCase()}` as AppErrorCode);
            var finalList : AppErrorCode[] = []; 
            for(const [key, value] of Object.entries(errorsPayload)){
                if(Array.isArray(value) && isAppErrorCode(value[0])){
                    finalList.push(value[0]);
                }else if(typeof value === 'string' && isAppErrorCode(value)){
                    finalList.push(value);
                }else{
                    console.log(key +" : " + value);
                }
            }
            if(finalList.length > 0) return finalList;
        }

        if(typeof errorsPayload === 'string'){
            return [ errorsPayload as AppErrorCode ];
        }
    }

    return ["SERVER_ERROR"];
}


/**
 * Safely extracts the error message from a fetch Response object.
 * Handles valid JSON, empty bodies, plain text, and network failures.
 */
export async function getErrorMessage(response: Response): Promise<AppErrorCode[]> {
    try{
        const contentType = response.headers.get("content-type");

        if(response.status === 401){
            return ["UNAUTHORIZED"]
        }

        if(response.status === 404){
            return ["NOT_FOUND"]
        }

        if (contentType && contentType.includes("application/json")) {
            const rawText = await response.text();
            if (!rawText.trim()) return ["EMPTY_RESPONSE"];

            const body = JSON.parse(rawText);
            // if (getErrorsHelper) return getErrorsHelper(body);
            return getErrors(body);
        }

        return ["SERVER_ERROR"];

    }catch{
        return ["PARSE_ERROR"];
    }
}


export class CustomApiError extends Error {

    public data: AppErrorCode[]

    constructor(data: AppErrorCode[], message: string = "An error occurred") {
        super(message);
        this.name = "CustomApiError";
        this.data = data;

        // Maintains proper stack trace for where our error was thrown (V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomApiError);
        }
    }
}
