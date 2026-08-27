

// import { cookies } from "next/headers";
import { API_URL, CustomApiError, getErrorMessage } from "./apiUtils";
import { ClientDetails } from "../types/Clients/ClientDetails";
import { ContractDetails } from "../types/Contracts/ContractDetails";
import { PrinterDetails } from "../types/Printers/PrinterDetails";
import { ContractSummary } from "../types/Contracts/ContractSummary";
import { ReadingSummary } from "../types/Readings/ReadingSummary";
import { PrinterSummary } from "../types/Printers/PrinterSummary";
import { Brand } from "../types/Printers/Brand";
import { EditPrinter } from "../types/Printers/EditPrinter";
import { CreateContract } from "../types/Contracts/CreateContract";
import { CreatePrinter } from "../types/Printers/CreatePrinter";
import { CreateClient } from "../types/Clients/CreateClient";
import { EditClient } from "../types/Clients/EditClient";
import { Credentials } from "../types/Auth/Login";
import { EditContract } from "../types/Contracts/EditContract";
import { CreateReading } from "../types/Readings/CreateReading";
import { EditReading } from "../types/Readings/EditReading";

// Printers endpoints -----------------------------------------------------------------------------------------------
export async function getBrands(): Promise<Brand[]>{
    const response =  await clientFetch(`/brands`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to get brands.");
    }

    return response.json();
}

export async function getPrinters(): Promise<PrinterSummary[]>{
    const response = await clientFetch(`/printers`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to get printers.");
    }

    return response.json();
}

export async function getPrinter(idPrinter: number): Promise<PrinterDetails>{

    const response = await clientFetch(`/printers/${idPrinter}`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to fetch printer.");
    }

    return response.json();
}

export async function createPrinter(newPrinter: CreatePrinter){
    const response = await clientFetch(`/printers`, {
        method: "POST",
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

export async function editPrinter(printerId: number, printer: EditPrinter){

    const response = await clientFetch(`/printers/${printerId}`, {
        method: "PUT",
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
    const response = await clientFetch(`/printers/${printerId}`, {
        method: "DELETE"
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to delete printer.");
    }
}

// Clients endpoints -----------------------------------------------------------------------------------------------
export async function getClients() {
    const response = await clientFetch(`/clients`);

    if(!response.ok){
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to fetch clients.");
    }

    return response.json();
}

export async function getClient(id: string): Promise<{client: ClientDetails; contracts: ContractDetails[];}>{
    const clientResponse = await clientFetch(`/clients/${id}`);
    const contractsResponse = await clientFetch(`/clients/${id}/contracts`);

    if(!clientResponse.ok)    {
        const errList = await getErrorMessage(clientResponse);
        throw new CustomApiError(errList, "Failed to fetch client.");
    }

    if(!contractsResponse.ok){
        const errList = await getErrorMessage(contractsResponse);
        throw new CustomApiError(errList, "Failed to fetch contracts for this client.");
    }

    const clientData = await clientResponse.json();
    const contractsList = await contractsResponse.json();

    return {
            client : clientData,
            contracts: contractsList,
            };
}

export async function createClient(newClient: CreateClient){
    const response = await clientFetch(`/clients`, {
        method: "POST",
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
    const response = await clientFetch(`/clients/${clientId}`, {
        method: "PUT",
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
    const response = await clientFetch(`/clients/${clientId}`, {
        method: "DELETE",
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to delete client.");
    }
}


// Contracts endpoints ------------------------------------------------------------------------------------------------------------------------------


export async function getContract(idClient: number, idContract: number): Promise<{contract: ContractSummary; readings: ReadingSummary[];}>{
    const contractResponse = await clientFetch(`/contracts/${idContract}`);
    const readingsResponse = await clientFetch(`/contracts/${idContract}/readings`);

    if(!contractResponse.ok)
    {
        const errList = await getErrorMessage(contractResponse);
        throw new CustomApiError(errList, "Failed to fetch contract details.");
    }

    if(!readingsResponse.ok)
    {
        const errList = await getErrorMessage(readingsResponse);
        throw new CustomApiError(errList, "Failed to fetch readings for this contract.");
    }

    const contractSummary : ContractSummary = await contractResponse.json();
    const readingsList : ReadingSummary[] = await readingsResponse.json();

    return{
        contract: contractSummary,
        readings: readingsList
    }
}

export async function createContract(newContract: CreateContract){
    const response = await clientFetch(`/contracts`, {
        method: "POST",
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

export async function editContract(contractId: number, contract: EditContract){
    const response = await clientFetch(`/contracts/${contractId}`, {
        method: "PUT",
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

export async function deleteContract(contractId: number){
    const response = await clientFetch(`/contracts/${contractId}`, {
        credentials: "include",
        method: "DELETE",
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to delete contract.");
    }
}


// Readings endpoints ----------------------------------------------------------------------------------------------------------
export async function createReading(newReading: CreateReading){
    const response = await clientFetch(`/monthly-readings`, {
        method: "POST",
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
    const response = await clientFetch(`/contracts/${contractId}/readings/${readingId}`, {
        method: "PUT",
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
    const response = await clientFetch(`/contracts/${contractId}/readings/${readingId}`, {
        method: "DELETE"
    });

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);
        throw new CustomApiError(errList, "Failed to delete reading.");
    }
}

// Auth endpoints ------------------------------------------------------------------------------------------
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
    const response = await clientFetch(`/register`, {
        method: "POST",
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


export async function clientFetch(path: string, options: RequestInit = {}) {
    return fetch(`${API_URL}${path}`, {
        credentials: "include",
        ...options,
    });
}