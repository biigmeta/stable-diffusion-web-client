const apiBase = "http://127.0.0.1:7860"

interface IRequestBody {
    method: "POST" | "GET" | "PUT" | "DELETE";
    endpoint: string;
    body?: any;
    headers?: Record<string, string>;
    options?: RequestInit;
}

export const httpRequest = async ({ method, endpoint, body, headers, options }: IRequestBody): Promise<any> => {
    try {

        const url = `${apiBase}${endpoint}`;

        const opt = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: method === "GET" ? null : JSON.stringify(body),
            ...options,
        }

        const response = await fetch(url, opt);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('HTTP Request failed:', error);
        throw error; // Re-throw the error for further handling
    }
}