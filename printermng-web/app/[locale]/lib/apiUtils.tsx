export const API_URL = process.env.NEXT_PUBLIC_API_URL!;  

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
    "TOO_MANY_REQUESTS",
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

        if(response.status)

        if(response.status === 401){
            return ["UNAUTHORIZED"]
        }

        if(response.status === 404){
            return ["NOT_FOUND"]
        }

        if(response.status === 429){
            return ["TOO_MANY_REQUESTS"]
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