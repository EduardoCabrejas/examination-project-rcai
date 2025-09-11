"use client";
import { useState } from "react";
import { FiltersBarProps } from "@/types/FiltersProps";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowBigUpDashIcon,
  ArrowBigDownDashIcon,
  Users2,
  BotIcon,
  BriefcaseBusinessIcon,
  Trash2,
  CalendarDaysIcon,
  CalendarArrowUp,
  CalendarArrowDown,
  CalendarRangeIcon,
  RefreshCcwIcon,
} from "lucide-react";
import GenericButton from "@/ui/GenericButton";

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

  const dateOptions = [
    {
      key: "showToday",
      icon: <CalendarArrowUp className="w-4 h-4 text-blue-800" />,
      label: "Today",
    },
    {
      key: "showYesterday",
      icon: <CalendarArrowDown className="w-4 h-4 text-blue-800" />,
      label: "Yesterday",
    },
    {
      key: "showThisWeek",
      icon: <CalendarRangeIcon className="w-4 h-4 text-blue-800" />,
      label: "This Week",
    },
    {
      key: "showOlder",
      icon: <CalendarDaysIcon className="w-4 h-4 text-blue-800" />,
      label: "Olders",
    },
  ];

  const typeOptions = [
    {
      key: "showBot",
      icon: <BotIcon className="w-4 h-4 text-blue-800" />,
      label: "Bot Messages",
    },
    {
      key: "showCustomer",
      icon: <Users2 className="w-4 h-4 text-blue-800" />,
      label: "Client Messages",
    },
    {
      key: "showBusiness",
      icon: <BriefcaseBusinessIcon className="w-4 h-4 text-blue-800" />,
      label: "Business Messages",
    },
    {
      key: "showDeleted",
      icon: <Trash2 className="w-4 h-4 text-blue-800" />,
      label: "Deleted Messages",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 relative z-30">
      {/* Barra principal */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center relative z-20">
        <GenericButton
          variant="search"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={
            isExpanded ? (
              <ArrowBigUpDashIcon className="w-4 h-4" />
            ) : (
              <ArrowBigDownDashIcon className="w-4 h-4" />
            )
          }
          aria-label="Messages Filters"
        >
          Filters
        </GenericButton>

        <h2 className="text-xs text-gray-600 md:text-lg">
          Showing <span className="font-medium">{filteredMessages}</span> of{" "}
          <span className="font-medium">{totalMessages}</span> mensajes
        </h2>

        <GenericButton
          variant="refresh"
          size="small"
          onClick={onReset}
          disabled={!hasActiveFilters}
          icon={<RefreshCcwIcon className="w-5 h-5 text-white" />}
          aria-label="Clean Filters"
        >
          Clean <span className="hidden md:inline-flex ml-2">Filters</span>
        </GenericButton>
      </div>

      {/* Panel overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-full z-40"
          >
            <div className="max-w-4xl mx-auto mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border-[2px] border-blue-500 shadow-lg">
              {/* Filtros de fecha */}
              <div>
                <h3 className="text-center font-medium text-gray-900 mb-3">
                  Por Fecha
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {dateOptions.map(({ key, icon, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-1 md:gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dateFilter[key as keyof typeof dateFilter]}
                        onChange={() =>
                          toggleDate(key as keyof typeof dateFilter)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {icon}
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
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map(({ key, icon, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-1 md:gap-2 cursor-pointer text-xs md:text-md"
                    >
                      <input
                        type="checkbox"
                        checked={
                          messageTypeFilter[
                            key as keyof typeof messageTypeFilter
                          ]
                        }
                        onChange={() =>
                          toggleMessageType(
                            key as keyof typeof messageTypeFilter
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {icon}
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
