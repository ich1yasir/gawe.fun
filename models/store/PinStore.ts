import CryptoJS from "crypto-js";

const PIN_KEY = "user_pin_hash";

export const PinStore = {
    setPin(pin: string) {
        const hash = CryptoJS.SHA256(pin).toString();
        localStorage.setItem(PIN_KEY, hash);
    },
    getPinHash(): string | null {
        return localStorage.getItem(PIN_KEY);
    },
    verifyPin(pin: string): boolean {
        const hash = CryptoJS.SHA256(pin).toString();
        return hash === localStorage.getItem(PIN_KEY);
    },
    hasPin(): boolean {
        return !!localStorage.getItem(PIN_KEY);
    }
};