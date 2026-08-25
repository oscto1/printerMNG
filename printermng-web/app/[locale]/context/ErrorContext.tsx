"use client"

import React, {createContext, useContext, useState} from "react";
import Modal from "../components/Modal";
import { AppErrorCode, CustomApiError } from "../lib/api";
import { useTranslations } from "next-intl";

interface ErrorContextType {
    showError: (err: unknown) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);


export function ErrorProvider({children}: {children: React.ReactNode}){
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null | AppErrorCode[]>(null);

    const t = useTranslations("errors");

    const showError = (err: unknown) => {
        setIsOpen(true);
        
        if(err instanceof CustomApiError){
            setErrorMessage(err.data);
        }
        else if(err instanceof Error){
            setErrorMessage(err.message);
        }else if (typeof err === 'string'){
            setErrorMessage(err);
        }else {
            setErrorMessage('An unexpected error occurred.');
        } 
    }

    const closeError = () => {
        setIsOpen(false);
        setErrorMessage(null);
    };

    return(
        <ErrorContext.Provider value={{showError}}>
            {children}
            <Modal open={isOpen} onClose={closeError}>
                <h1 className="text-heading md:text-2xl lg:text-2xl mb-2">ERROR!</h1>
                {(Array.isArray(errorMessage)) ? 
                    <ul className="list-disc pl-5"> {errorMessage.map((err, index) => (<li key={index}>{t(err)}</li>))} </ul> 
                :   <p>{(errorMessage !== null ? t(errorMessage) : "An unexpected error occurred.")}</p>}
                
                 
            </Modal>
        </ErrorContext.Provider>
    )
}

export function useError() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}