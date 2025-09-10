"use client";
import { useState, useMemo, useRef } from "react";
import { setMilliseconds, setSeconds } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useMessageGroups } from "@/utils/dateGrouping";
import {
  DateFilter,
  MessageTypeFilter,
  MessageGroup,
} from "@/types/FiltersProps";
import FiltersBar from "@/components/FiltersBar";
import { MessageCard } from "@/components/MessageCard";
import GenericButton from "@/ui/GenericButton";

export default function MessagesPage() {
  const { messages, loading, error, refetch } = useMessages();

  const messagesStartRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [dateFilter, setDateFilter] = useState<DateFilter>({
    showToday: false,
    showYesterday: false,
    showThisWeek: false,
    showOlder: false,
  });

  const [messageTypeFilter, setMessageTypeFilter] = useState<MessageTypeFilter>(
    {
      showBot: false,
      showCustomer: false,
      showBusiness: false,
      showDeleted: false,
    }
  );

  // First make groups in base of date
  const groups = useMessageGroups(messages);

  // Then we filter groups + messages
  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        // Filter By Date
        const anyDateFilterActive = Object.values(dateFilter).some(Boolean);
        let dateMatch = true; // If there is not filters, all pass

        if (anyDateFilterActive) {
          dateMatch = false;
          if (dateFilter.showToday && group.isToday) dateMatch = true;
          if (dateFilter.showYesterday && group.isYesterday) dateMatch = true;
          if (
            dateFilter.showThisWeek &&
            group.isThisWeek &&
            !group.isToday &&
            !group.isYesterday
          )
            dateMatch = true;
          if (
            dateFilter.showOlder &&
            !group.isToday &&
            !group.isYesterday &&
            !group.isThisWeek
          )
            dateMatch = true;
        }

        if (!dateMatch) return null;

        // Filters By Type
        const anyTypeFilterActive =
          Object.values(messageTypeFilter).some(Boolean);
        const filteredMessages = group.messages.filter((msg) => {
          if (!anyTypeFilterActive) return true;
          if (messageTypeFilter.showDeleted && msg.is_deleted) return true;
          if (messageTypeFilter.showBot && msg.bot_sender) return true;
          if (messageTypeFilter.showCustomer && msg.sent_by_customer)
            return true;
          if (
            messageTypeFilter.showBusiness &&
            !msg.bot_sender &&
            !msg.sent_by_customer
          )
            return true;
          return false;
        });

        if (filteredMessages.length === 0) return null;

        return { ...group, messages: filteredMessages };
      })
      .filter((g): g is MessageGroup => g !== null);
  }, [groups, dateFilter, messageTypeFilter]);

  const filteredCount = useMemo(
    () => filteredGroups.reduce((acc, g) => acc + g.messages.length, 0),
    [filteredGroups]
  );

  const resetFilters = () => {
    setDateFilter({
      showToday: true,
      showYesterday: true,
      showThisWeek: true,
      showOlder: true,
    });
    setMessageTypeFilter({
      showBot: true,
      showCustomer: true,
      showBusiness: true,
      showDeleted: false,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Messages...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 font-semibold mb-2">
              Error al cargar mensajes
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div ref={messagesStartRef} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Messages ({messages.length})
            </h1>
            <button
              onClick={refetch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </header>

      {/* FiltersBar */}
      <FiltersBar
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        messageTypeFilter={messageTypeFilter}
        onMessageTypeFilterChange={setMessageTypeFilter}
        totalMessages={messages.length}
        filteredMessages={filteredCount}
        onReset={resetFilters}
      />

      {/* Contenedor principal */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay mensajes para mostrar
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.date}>
                {/* Header de fecha */}
                <div className="sticky top-20 bg-gray-50 px-2 py-1 text-gray-700 font-semibold border-b border-gray-200 z-10">
                  {group.label}
                </div>

                {/* Mensajes del grupo */}
                <div className="space-y-4 mt-2">
                  {group.messages.map((message, idx) => {
                    const fixDate = setMilliseconds(
                      setSeconds(new Date(message.message_date), 0),
                      0
                    );
                    return (
                      <MessageCard
                        key={`${message.customer}-${fixDate}-${idx}`}
                        message={message}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <div className="flex flex-col gap-2 fixed right-2 top-20 md:bottom-8 md:top-auto z-50">
        <GenericButton
          variant="jump"
          size="small"
          spanClassName="ms-3"
          onClick={() =>
            messagesStartRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          icon={<ArrowUp className="w-5 h-5 text-white" />}
        >
          Go Top
        </GenericButton>

        <GenericButton
          variant="jump"
          size="small"
          onClick={() =>
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          icon={<ArrowDown className="w-5 h-5 text-white" />}
        >
          Go Bottom
        </GenericButton>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
