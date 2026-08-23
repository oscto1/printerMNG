import { ClientDetails } from "../types/Clients/ClientDetails";
import { ContractDetails } from "../types/Contracts/ContractDetails";
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
import { PrinterDetails } from "../types/Printers/PrinterDetails";
import { EditPrinter } from "../types/Printers/EditPrinter";
import { Credentials } from "../types/Auth/Login";

const API_URL = "http://localhost:5280"

export async function getClients() {
    const response = await fetch(`${API_URL}/clients`);

    if(!response.ok){
        throw new Error("Failed to fetch clients.");
    }

    return response.json();
}

export async function getClient(id: string): Promise<{client: ClientDetails; contracts: ContractDetails[];}>{
    const clientResponse = await fetch(`${API_URL}/clients/${id}`);
    const contractsResponse = await fetch(`${API_URL}/clients/${id}/contracts`);

    if (!clientResponse.ok) {
        throw new Error(`Failed to fetch client ${id}.`);
    }

    if (!contractsResponse.ok) {
        throw new Error(`Failed to fetch contracts for client ${id}.`);
    }


    const clientData = await clientResponse.json();
    const contractsList = await contractsResponse.json();

    return {
            client : clientData,
            contracts: contractsList,
            };
}

export async function getContract(idClient: number, idContract: number): Promise<{contract: ContractSummary; readings: ReadingSummary[];}>{
    const contractResponse = await fetch(`${API_URL}/contracts/${idContract}`);
    const readingsResponse = await fetch(`${API_URL}/contracts/${idContract}/readings`);

    if(!readingsResponse.ok){
        throw new Error(`Failed to fetch contract details.`);
    }

    if(!readingsResponse.ok){
        throw new Error(`Failed to fetch readings for this contract.`);
    }

    const contractSummary : ContractSummary = await contractResponse.json();
    const readingsList : ReadingSummary[] = await readingsResponse.json();

    return{
        contract: contractSummary,
        readings: readingsList
    }
}

export async function getPrinter(idPrinter: number): Promise<PrinterDetails>{
    const response = await fetch(`${API_URL}/printers/${idPrinter}`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }

    return response.json();
}

export async function editPrinter(printerId: number, printer: EditPrinter){
    const response = await fetch(`${API_URL}/printers/${printerId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(printer)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function deletePrinter(printerId: number){
    const response = await fetch(`${API_URL}/printers/${printerId}`, {
        method: "DELETE"
    });

    if(!response.ok){
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function createReading(newReading: CreateReading){
    const response = await fetch(`${API_URL}/monthly-readings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newReading)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }

}

export async function editReading(contractId: number, readingId: number, reading: EditReading){
    const response = await fetch(`${API_URL}/contracts/${contractId}/readings/${readingId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reading)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}   

export async function deleteReading(contractId: number, readingId: number){
    const response = await fetch(`${API_URL}/contracts/${contractId}/readings/${readingId}`, {
        method: "DELETE"
    });

    if(!response.ok){
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function createClient(newClient: CreateClient){
    const response = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newClient)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function editClient(clientId: number, editedClient: EditClient){
    const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editedClient)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function deleteClient(clientId: number){
    const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: "DELETE",
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function getBrands(): Promise<Brand[]>{
    const response = await fetch(`${API_URL}/brands`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }

    return response.json();
}

export async function getPrinters(): Promise<PrinterSummary[]>{
    const response = await fetch(`${API_URL}/printers`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }

    return response.json();
}

export async function createPrinter(newPrinter: CreatePrinter){
    const response = await fetch(`${API_URL}/printers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPrinter)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function createContract(newContract: CreateContract){
    const response = await fetch(`${API_URL}/contracts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContract)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function deleteContract(contractId: number){
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
        method: "DELETE",
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}

export async function editContract(contractId: number, contract: EditContract){
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contract)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }
}


export async function login(credentials: Credentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response, getErrors);

        throw new Error(JSON.stringify(errList));
    }

    return response.json();
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
        const errorCodes = await getErrorMessage(clonedResponse, getErrors);
        throw new Error(JSON.stringify(errorCodes));
    }
}

export type AppErrorCode =
  // .NET Identity codes
  | "DuplicateUserName"
  | "DuplicateEmail"
  | "InvalidEmail"
  | "PasswordTooShort"
  | "PasswordRequiresDigit"
  | "PasswordRequiresUpper"
  // Generic codes
  | "SERVER_ERROR"       // HTML responses, 500 codes, etc.
  | "EMPTY_RESPONSE"     // empty JSON
  | "PARSE_ERROR"         // JSON parse failed
  | "UNKNOWN_ERROR";     // Uncontrolled cases


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
            return Object.keys(errorsPayload).map(field => `INVALID_${field.toUpperCase()}` as AppErrorCode);
        }
    }

    return ["SERVER_ERROR"];
}


/**
 * Safely extracts the error message from a fetch Response object.
 * Handles valid JSON, empty bodies, plain text, and network failures.
 */
async function getErrorMessage(response: Response, getErrorsHelper?: (body: any) => AppErrorCode[]): Promise<AppErrorCode[]> {
    try{
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const rawText = await response.text();
            if (!rawText.trim()) return ["EMPTY_RESPONSE"];

            const body = JSON.parse(rawText);
            if (getErrorsHelper) return getErrorsHelper(body);
            
            return ["SERVER_ERROR"];
        }

        return ["SERVER_ERROR"];

    }catch{
        return ["PARSE_ERROR"];
    }

}