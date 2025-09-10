"use client";
import { useState } from "react";
import { FiltersBarProps } from "@/types/FiltersProps";

export default function FiltersBar({
  dateFilter,
  onDateFilterChange,
  messageTypeFilter,
  onMessageTypeFilterChange,
  totalMessages,
  filteredMessages,
  onReset,
}: FiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDate = (key: keyof typeof dateFilter) => {
    onDateFilterChange({
      ...dateFilter,
      [key]: !dateFilter[key],
    });
  };

  const toggleMessageType = (key: keyof typeof messageTypeFilter) => {
    onMessageTypeFilterChange({
      ...messageTypeFilter,
      [key]: !messageTypeFilter[key],
    });
  };

  const hasActiveFilters =
    Object.values(dateFilter).some(Boolean) ||
    Object.values(messageTypeFilter).some(Boolean);

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Barra principal */}
      <div className="relative max-w-4xl mx-auto px-4 py-3">
        <div className="flex flex-row justify-around items-center w-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>🔍</span>
            <span className="font-medium">Filtros</span>
            <span
              className={`transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <h2 className="text-gray-600">
            Mostrando <span className="font-medium">{filteredMessages}</span> de{" "}
            <span className="font-medium">{totalMessages}</span> mensajes
          </h2>

          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Panel expandible */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 absolute w-full mt-4 p-4 bg-gray-50 rounded-lg border-[2px] border-blue-500">
            {/* Filtros de fecha */}
            <div>
              <h3 className="text-center font-medium text-gray-900 mb-3">
                Por Fecha
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "showToday", label: "📅 Hoy" },
                  { key: "showYesterday", label: "📆 Ayer" },
                  { key: "showThisWeek", label: "🗂️ Esta semana" },
                  { key: "showOlder", label: "📦 Más antiguos" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={dateFilter[key as keyof typeof dateFilter]}
                      onChange={() =>
                        toggleDate(key as keyof typeof dateFilter)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtros por tipo */}
            <div>
              <h3 className="text-center font-medium text-gray-900 mb-3">
                Por Tipo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { key: "showBot", label: "🤖 Mensajes de Bot" },
                  { key: "showCustomer", label: "👤 Mensajes de Cliente" },
                  { key: "showBusiness", label: "🏢 Mensajes de Negocio" },
                  { key: "showDeleted", label: "🗑️ Mensajes Eliminados" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        messageTypeFilter[key as keyof typeof messageTypeFilter]
                      }
                      onChange={() =>
                        toggleMessageType(key as keyof typeof messageTypeFilter)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
