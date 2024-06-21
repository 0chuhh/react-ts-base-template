import { useCallback, useEffect, useState } from "react";

type StoredValue = object | string | number | boolean | null;

type SetStoredValueCallback<T = StoredValue> = (prevValue: T | null) => T | null;

type SetStoredValueArg<T = StoredValue> = T extends StoredValue ? T | SetStoredValueCallback<T> : never;

type SetStoredValue<T = StoredValue> = (newValue: SetStoredValueArg<T>) => void;

type RemoveValue = () => void;

type UseSessionStorageReturnType<T = StoredValue> = [T | null, SetStoredValue<T>, RemoveValue];


export const useSessionStorage = <T = StoredValue>(key: string, initValue?: T): UseSessionStorageReturnType<T> => {
    
    const [value, setValue] = useState<T | null>(initValue === undefined ? null : initValue);

    const getItem = useCallback(() => {
        const storedValue = sessionStorage.getItem(key);
        if (!storedValue) {
            return;
        }
        const parsedValue: T | null = JSON.parse(storedValue);
        setValue(parsedValue);
    }, [key]);

    const setItem: SetStoredValue<T> = useCallback((newItem) => {
        setValue((prev) => {
            if (typeof newItem === 'function') {
                const newValue: T | null = newItem(prev);
                sessionStorage.setItem(key, JSON.stringify(newValue));
                return newValue;
            }
            sessionStorage.setItem(key, JSON.stringify(newItem));
            return null;

        });
    }, [key]);

    const removeItem: RemoveValue = useCallback(() => {
        setValue(null);
        sessionStorage.removeItem(key);
    }, [key]);

    useEffect(() => {
        getItem();
    }, [getItem]);

    return [value, setItem, removeItem];
};
