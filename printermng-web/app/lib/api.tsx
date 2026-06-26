const API_URL = "http://localhost:5280"

export async function getClients() {
    const response = await fetch(`${API_URL}/clients`);

    if(!response.ok){
        throw new Error("Failed to fetch clients.");
    }

    return response.json();
}