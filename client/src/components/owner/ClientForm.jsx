import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export const ClientForm = ({ initialValues, onSubmit, isSubmitting, submitLabel = "Save" }) => {
    const [values, setValues] = useState({
        name: initialValues?.name || "",
        email: initialValues?.email || "",
        phone: initialValues?.phone || "",
        address: initialValues?.address || "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) =>
        setValues((prev) => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const next = {};
        if (!values.name.trim()) next.name = "Name is required";
        if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
            next.email = "A valid email is required";
        if (!values.phone.trim() || values.phone.trim().length < 7)
            next.phone = "A valid phone number is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Full name"
                name="name"
                value={values.name}
                onChange={handleChange("name")}
                error={errors.name}
                placeholder="Rohan Mehta"
            />
            <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                error={errors.email}
                placeholder="rohan@email.com"
            />
            <Input
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange("phone")}
                error={errors.phone}
                placeholder="9876543210"
            />
            <Input
                label="Address (optional)"
                name="address"
                value={values.address}
                onChange={handleChange("address")}
                placeholder="Pune, MH"
            />

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
            </Button>
        </form>
    );
};