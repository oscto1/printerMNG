import { error } from "console";
import { ClientDetails } from "../types/Clients/ClientDetails";
import { ContractDetails } from "../types/Contracts/ContractDetails";
import { ContractSummary } from "../types/Contracts/ContractSummary";
import { CreateReading } from "../types/Readings/CreateReading";
import { ReadingSummary } from "../types/Readings/ReadingSummary";
import { read } from "fs";
import { CreateClient } from "../types/Clients/CreateClient";
import { PrinterSummary } from "../types/Printers/PrinterSummary";
import { CreateContract } from "../types/Contracts/CreateContract";

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
        const errMessage = await getErrorMessage(response, getErrors);

        throw new Error(errMessage);
    }

}

export async function deleteReading(contractId: number, readingId: number){
    const response = await fetch(`${API_URL}/contracts/${contractId}/readings/${readingId}`, {
        method: "DELETE"
    });

    if(!response.ok){
        const errMessage = await getErrorMessage(response, getErrors);
        throw new Error(errMessage);
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
        const errMessage = await getErrorMessage(response, getErrors);

        throw new Error(errMessage);
    }
}


export async function getPrinters(): Promise<PrinterSummary[]>{
    const response = await fetch(`${API_URL}/printers`);

    if(!response.ok)
    {
        const errMessage = await getErrorMessage(response, getErrors);

        throw new Error(errMessage);
    }

    return response.json();
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
        const errMessage = await getErrorMessage(response, getErrors);

        throw new Error(errMessage);
    }
}

function getErrors(body: any) : string {
    var errorString: string = "\n";
    
    if(body["errors"]){
        console.log(body["errors"]);
        if(typeof body["errors"] === 'object')
        {
            Object.values(body["errors"] as string[]).forEach((error: string) => {
                errorString += "- " + error;
                errorString += "\n";
            });

        }else{
            errorString += body["errors"];
        }
    }else
    {
        errorString += "- " + body;
    }    

    return errorString;
}


/**
 * Safely extracts the error message from a fetch Response object.
 * Handles valid JSON, empty bodies, plain text, and network failures.
 */
async function getErrorMessage(response: Response, getErrorsHelper?: (body: any) => string): Promise<string> {
  try {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {

      const rawText = await response.text();
      if (!rawText.trim()) {
        return `Server returned an empty JSON response (Status ${response.status})`;
      }

      const body = JSON.parse(rawText);
      
      if (getErrorsHelper) {
        return getErrorsHelper(body);
      }
      return body.message || body.error || JSON.stringify(body);
    }

    // Fallback for plain text or HTML error pages
    const textFallback = await response.text();
    if (textFallback.trim()) {
      // Truncate text if it's a massive HTML crash page
      return textFallback.length > 150 ? `${textFallback.substring(0, 150)}...` : textFallback;
    }

    // Last fallback if the body is completely empty - Like a not allowed method
    return `Request failed with status ${response.status} (${response.statusText})`;
    
  } catch (parseError) {
    // Catch block in case response.text() or JSON.parse fails unexpectedly
    return `Failed to parse server response (Status ${response.status})`;
  }
}