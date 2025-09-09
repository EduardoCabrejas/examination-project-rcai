// src/components/FiltersBar.tsx
"use client";
import { useState } from "react";
import {
  FiltersBarProps,
  DateFilter,
  MessageTypeFilter,
} from "@/types/FiltersProps";

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

  const toggleDateFilter = (key: keyof DateFilter) => {
    onDateFilterChange({
      ...dateFilter,
      [key]: !dateFilter[key],
    });
  };

  const toggleMessageTypeFilter = (key: keyof MessageTypeFilter) => {
    onMessageTypeFilterChange({
      ...messageTypeFilter,
      [key]: !messageTypeFilter[key],
    });
  };

  const hasActiveFilters =
    !dateFilter.showToday ||
    !dateFilter.showYesterday ||
    !dateFilter.showThisWeek ||
    !dateFilter.showOlder ||
    !messageTypeFilter.showBot ||
    !messageTypeFilter.showCustomer ||
    !messageTypeFilter.showBusiness ||
    messageTypeFilter.showDeleted;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
      {/* Barra principal */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>🔍</span>
              <span className="font-medium">Filters</span>
              <span
                className={`transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredMessages}</span>{" "}
              <span className="font-medium">{totalMessages}</span> messages
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clean filters
            </button>
          )}
        </div>

        {/* Panel expandible */}
        {isExpanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Filtros de fecha */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">By Date</h3>
                <div className="space-y-2">
                  {[
                    { key: "showToday", label: "Today" },
                    { key: "showYesterday", label: "Yesterday" },
                    { key: "showThisWeek", label: "This Week" },
                    { key: "showOlder", label: "Older" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dateFilter[key as keyof DateFilter]}
                        onChange={() =>
                          toggleDateFilter(key as keyof DateFilter)
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
                <h3 className="font-medium text-gray-900 mb-3">By Type</h3>
                <div className="space-y-2">
                  {[
                    { key: "showBot", label: "🤖 Bot Messages" },
                    { key: "showCustomer", label: "👤 Client Messages" },
                    { key: "showBusiness", label: "🏢 Business Messages" },
                    { key: "showDeleted", label: "🗑️ Deleted Messages" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          messageTypeFilter[key as keyof MessageTypeFilter]
                        }
                        onChange={() =>
                          toggleMessageTypeFilter(
                            key as keyof MessageTypeFilter
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
