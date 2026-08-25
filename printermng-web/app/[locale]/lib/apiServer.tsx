'use server'

import { cookies } from "next/headers";
import { API_URL, CustomApiError, getErrorMessage } from "./api";
import { ClientDetails } from "../types/Clients/ClientDetails";
import { ContractDetails } from "../types/Contracts/ContractDetails";
import { PrinterDetails } from "../types/Printers/PrinterDetails";
import { ContractSummary } from "../types/Contracts/ContractSummary";
import { ReadingSummary } from "../types/Readings/ReadingSummary";



export async function getClients() {
    const response = await serverFetch(`/clients`);

    if(!response.ok){
            //TODO: Change error code
        const errList = await getErrorMessage(response);
        
        throw new CustomApiError(errList, "Failed to fetch clients.");
    }

    return response.json();
}

export async function getClient(id: string): Promise<{client: ClientDetails; contracts: ContractDetails[];}>{
    // console.log("calling getClient");
    const clientResponse = await serverFetch(`/clients/${id}`);
    const contractsResponse = await serverFetch(`/clients/${id}/contracts`);

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

export async function getPrinter(idPrinter: number): Promise<PrinterDetails>{

    const response = await serverFetch(`/printers/${idPrinter}`);

    if(!response.ok)
    {
        const errList = await getErrorMessage(response);

        throw new CustomApiError(errList, "Failed to fetch printer.");
    }

    return response.json();
}


export async function getContract(idClient: number, idContract: number): Promise<{contract: ContractSummary; readings: ReadingSummary[];}>{
    const contractResponse = await serverFetch(`/contracts/${idContract}`);
    const readingsResponse = await serverFetch(`/contracts/${idContract}/readings`);

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




export async function serverFetch(path: string, options: RequestInit = {}) {
    const cookieStore = await cookies();

    const headers = new Headers(options.headers);
    headers.set("Cookie", cookieStore.toString());

    return fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });
}