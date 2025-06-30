import React, { useState } from "react";

type PinModalProps = {
    open: boolean;
    onSubmit: (pin: string) => void;
    isSetPin: boolean;
};

const PinModal: React.FC<PinModalProps> = ({ open, onSubmit, isSetPin }) => {
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSetPin) {
            if (pin.length !== 4) {
                setError("PIN must be 4 characters.");
                return;
            }
            if (pin !== confirmPin) {
                setError("PINs do not match.");
                return;
            }
            setError("");
            onSubmit(pin);
        } else {
            if (pin.length !== 4) {
                setError("PIN must be 4 characters.");
                return;
            }
            setError("");
            onSubmit(pin);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-xs w-full flex flex-col items-center"
                onSubmit={handleSubmit}
            >
                <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                    {isSetPin ? "Set Your 4-Digit PIN" : "Enter Your 4-Digit PIN"}
                </div>
                <label className="w-full mb-1 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="pin-input">
                    {isSetPin ? "Enter PIN" : "PIN"}
                </label>
                <input
                    id="pin-input"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    minLength={4}
                    autoFocus
                    className="mb-2 w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-center text-2xl tracking-widest  bg-gray-50 dark:bg-gray-900"
                    value={pin}
                    onChange={e => {
                        setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4));
                        setError("");
                    }}
                    placeholder="••••"
                />
                {isSetPin && (
                    <>
                        <label className="w-full mb-1 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirm-pin-input">
                            Confirm PIN
                        </label>
                        <input
                            id="confirm-pin-input"
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            minLength={4}
                            className="mb-2 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-center text-2xl tracking-widest w-full bg-gray-50 dark:bg-gray-900"
                            value={confirmPin}
                            onChange={e => {
                                setConfirmPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4));
                                setError("");
                            }}
                            placeholder="Confirm"
                        />
                    </>
                )}
                {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
                <button
                    type="submit"
                    className="mt-2 px-6 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 font-semibold w-full"
                >
                    {isSetPin ? "Set PIN" : "Unlock"}
                </button>
            </form>
        </div>
    );
};

export default PinModal;