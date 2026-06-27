import { ClientDetails } from "../types/ClientDetails";
import { ContractDetails } from "../types/ContractDetails";

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