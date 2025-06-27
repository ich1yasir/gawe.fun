'use client'
import React, { useState } from "react";

const sectors = [
    "Finance",
    "Hospitality",
    "Goverment",
    "Restaurant",
    "Other",
];

const employeeRanges = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
];

const steps = [
    "Basic Info",
    "Company Info",
    "Login/Register"
];

const CreateAntrian: React.FC = () => {
    const [step, setStep] = useState(1);

    // Step 1
    const [namaAntrian, setNamaAntrian] = useState("");
    const [prefixCode, setPrefixCode] = useState("");

    // Step 2
    const [sector, setSector] = useState("");
    const [employeeRange, setEmployeeRange] = useState("");

    // Step 3
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isStep1Valid = namaAntrian.trim() !== "" && prefixCode.trim() !== "";
    const isStep2Valid = sector.trim() !== "" && employeeRange.trim() !== "";
    const isStep3Valid = email.trim() !== "" && password.trim() !== "";

    const handleNext = () => {
        if (step === 1 && !isStep1Valid) return;
        if (step === 2 && !isStep2Valid) return;
        setStep((s) => s + 1);
    };
    const handleBack = () => setStep((s) => s - 1);

    const handleGoogleLogin = () => {
        alert("Google login not implemented");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStep3Valid) return;
        alert("Form submitted!");
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-xl shadow-md bg-white dark:bg-zinc-900 transition-colors duration-300 mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100 text-center">
                Create Antrian <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">Step {step} of 3</span>
            </h2>
            <div className="flex justify-between mb-8">
                {steps.map((label, idx) => (
                    <div
                        key={label}
                        className={`flex-1 text-center py-2 rounded transition-colors duration-200
                            ${step === idx + 1
                                ? "bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-400 dark:text-zinc-500"
                            }`}
                    >
                        <span className="text-xs">{idx + 1}. {label}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                                Nama Antrian
                            </label>
                            <input
                                type="text"
                                value={namaAntrian}
                                onChange={(e) => setNamaAntrian(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Nama Antrian"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                                Prefix Code Antrian
                            </label>
                            <input
                                type="text"
                                value={prefixCode}
                                onChange={(e) => setPrefixCode(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Prefix Code"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep1Valid}
                            className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                                Company Sector
                            </label>
                            <select
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">Select sector</option>
                                {sectors.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                                Number of Employees
                            </label>
                            <select
                                value={employeeRange}
                                onChange={(e) => setEmployeeRange(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">Select range</option>
                                {employeeRanges.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!isStep2Valid}
                                className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Password"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isStep3Valid}
                                className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 transition"
                            >
                                Register / Login
                            </button>
                        </div>
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
                            <span className="mx-3 text-xs text-zinc-400 dark:text-zinc-500">or</span>
                            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
                        </div>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-2 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 48 48">
                                <g>
                                    <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 32.6 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z"/>
                                    <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3c-7.1 0-13.2 3.7-16.7 9.7z"/>
                                    <path fill="#FBBC05" d="M24 45c6.1 0 11.2-2 14.9-5.4l-6.9-5.7C29.7 36.9 27 38 24 38c-6.1 0-11.3-4.1-13.2-9.7l-7 5.4C6.8 41.3 14.7 45 24 45z"/>
                                    <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 6.5-11.7 6.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3c-7.1 0-13.2 3.7-16.7 9.7z"/>
                                </g>
                            </svg>
                            Login with Google
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateAntrian;