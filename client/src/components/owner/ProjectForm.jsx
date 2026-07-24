import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ClientSelect } from "./ClientSelect";

export const ProjectForm = ({ initialValues, onSubmit, isSubmitting, submitLabel = "Save", isEdit = false }) => {
    const [values, setValues] = useState({
        title: initialValues?.title || "",
        description: initialValues?.description || "",
        client: initialValues?.client?._id || initialValues?.client || "",
        budget: initialValues?.budget || "",
        startDate: initialValues?.startDate?.slice(0, 10) || "",
        estimatedEndDate: initialValues?.estimatedEndDate?.slice(0, 10) || "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) =>
        setValues((prev) => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const next = {};
        if (!values.title.trim()) next.title = "Project title is required";
        if (!isEdit && !values.client) next.client = "Please select a client";
        if (values.budget && (isNaN(values.budget) || Number(values.budget) < 0))
            next.budget = "Budget must be a non-negative number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            title: values.title.trim(),
            description: values.description.trim(),
            budget: values.budget ? Number(values.budget) : 0,
            startDate: values.startDate || undefined,
            estimatedEndDate: values.estimatedEndDate || undefined,
        };
        if (!isEdit) payload.client = values.client;

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Project title"
                name="title"
                value={values.title}
                onChange={handleChange("title")}
                error={errors.title}
                placeholder="Mehta Residence - Interior"
            />

            {!isEdit && (
                <ClientSelect
                    value={values.client}
                    onChange={(v) => setValues((prev) => ({ ...prev, client: v }))}
                    error={errors.client}
                />
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">Description (optional)</label>
                <textarea
                    value={values.description}
                    onChange={handleChange("description")}
                    rows={3}
                    placeholder="3BHK interior design and construction"
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:border-primary transition-colors"
                />
            </div>

            <Input
                label="Budget (₹, optional)"
                name="budget"
                type="number"
                value={values.budget}
                onChange={handleChange("budget")}
                error={errors.budget}
                placeholder="1500000"
            />

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Start date"
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={handleChange("startDate")}
                />
                <Input
                    label="Est. end date"
                    name="estimatedEndDate"
                    type="date"
                    value={values.estimatedEndDate}
                    onChange={handleChange("estimatedEndDate")}
                />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
            </Button>
        </form>
    );
};