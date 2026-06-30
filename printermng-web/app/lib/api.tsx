import { ClientDetails } from "../types/ClientDetails";
import { ContractDetails } from "../types/ContractDetails";
import { ContractSummary } from "../types/ContractSummary";
import { ReadingSummary } from "../types/ReadingSummary";

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

export default async function getContract(idClient: number, idContract: number): Promise<{contract: ContractSummary; readings: ReadingSummary[];}>{
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