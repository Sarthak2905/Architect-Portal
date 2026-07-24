import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useClients } from "../../api/hooks/useClients";
import { useClickOutside } from "../../api/hooks/useClickOutside";

/**
 * A real searchable combobox: type to filter, results show immediately
 * in a dropdown list below the input, click one to select. Replaces
 * the old search-input + native-<select> pair, which didn't visibly
 * update as you typed.
 */
export const ClientSelect = ({ value, onChange, error, initialLabel = "" }) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(initialLabel);

    const { data, isLoading } = useClients({ search, page: 1, limit: 20, status: "active" });
    const containerRef = useClickOutside(() => setIsOpen(false));

    const handleSelect = (client) => {
        onChange(client._id);
        setSelectedLabel(`${client.name} — ${client.phone}`);
        setSearch("");
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange("");
        setSelectedLabel("");
        setSearch("");
    };

    return (
        <div className="flex flex-col gap-1.5" ref={containerRef}>
            <label className="text-sm font-medium text-muted">Client</label>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />

                <input
                    type="text"
                    value={isOpen ? search : selectedLabel}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearch("");
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search clients by name, email, or phone..."
                    className={`w-full pl-9 pr-9 py-2.5 rounded-md border bg-white text-sm focus:border-primary transition-colors ${error ? "border-error" : "border-border"
                        }`}
                />

                {value && !isOpen && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                        aria-label="Clear selected client"
                    >
                        <X size={16} />
                    </button>
                )}
                {!value && <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />}

                {isOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-surface border border-border rounded-md shadow-elevated max-h-56 overflow-y-auto">
                        {isLoading ? (
                            <p className="px-3 py-2.5 text-sm text-muted">Searching...</p>
                        ) : !data?.clients?.length ? (
                            <p className="px-3 py-2.5 text-sm text-muted">No matching clients</p>
                        ) : (
                            data.clients.map((c) => (
                                <button
                                    key={c._id}
                                    type="button"
                                    onClick={() => handleSelect(c)}
                                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors border-b border-border last:border-0"
                                >
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-xs text-muted">{c.email} · {c.phone}</p>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {error && <span className="text-xs text-error">{error}</span>}
        </div>
    );
};