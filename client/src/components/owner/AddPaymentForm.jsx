import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { PAYMENT_ENTRY_TYPES, PAYMENT_METHODS } from "../../utils/paymentTypes";

export const AddPaymentForm = ({ onSubmit, isSubmitting }) => {
    const [values, setValues] = useState({
        type: "Invoice",
        amount: "",
        method: "Bank Transfer",
        referenceNumber: "",
        date: new Date().toISOString().slice(0, 10),
        notes: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.amount || isNaN(values.amount) || Number(values.amount) <= 0) {
            setError("Amount must be a positive number");
            return;
        }
        setError("");

        const payload = {
            type: values.type,
            amount: Number(values.amount),
            referenceNumber: values.referenceNumber.trim(),
            date: values.date,
            notes: values.notes.trim(),
        };
        if (values.type === "Payment") payload.method = values.method;

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">Entry type</label>
                <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_ENTRY_TYPES.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setValues((p) => ({ ...p, type: t }))}
                            className={`py-2.5 rounded-md text-sm font-medium border transition-colors ${values.type === t
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white text-muted border-border hover:border-primary hover:text-primary"
                                }`}
                        >
                            {t === "Invoice" ? "Raise Invoice" : "Record Payment"}
                        </button>
                    ))}
                </div>
            </div>

            <Input
                label="Amount (₹)"
                type="number"
                value={values.amount}
                onChange={(e) => setValues((p) => ({ ...p, amount: e.target.value }))}
                error={error}
                placeholder="100000"
            />

            {values.type === "Payment" && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted">Method</label>
                    <select
                        value={values.method}
                        onChange={(e) => setValues((p) => ({ ...p, method: e.target.value }))}
                        className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm"
                    >
                        {PAYMENT_METHODS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            )}

            <Input
                label="Reference number (optional)"
                value={values.referenceNumber}
                onChange={(e) => setValues((p) => ({ ...p, referenceNumber: e.target.value }))}
                placeholder={values.type === "Invoice" ? "INV-001" : "UTR123456"}
            />

            <Input
                label="Date"
                type="date"
                value={values.date}
                onChange={(e) => setValues((p) => ({ ...p, date: e.target.value }))}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">Notes (optional)</label>
                <textarea
                    value={values.notes}
                    onChange={(e) => setValues((p) => ({ ...p, notes: e.target.value }))}
                    rows={2}
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:border-primary transition-colors"
                />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : values.type === "Invoice" ? "Raise invoice" : "Record payment"}
            </Button>
        </form>
    );
};