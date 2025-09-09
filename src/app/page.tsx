"use client";
import { useState, useMemo } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useMessageGroups } from "@/utils/dateGrouping";
import { Message } from "@/types/MessagesProps";
import {
  DateFilter,
  MessageTypeFilter,
  MessageGroup,
} from "@/types/FiltersProps";
import FiltersBar from "@/components/FiltersBar";
import { setMilliseconds, setSeconds, format } from "date-fns";

export default function MessagesPage() {
  const { messages, loading, error, refetch } = useMessages();

  const [dateFilter, setDateFilter] = useState<DateFilter>({
    showToday: true,
    showYesterday: true,
    showThisWeek: true,
    showOlder: true,
  });

  const [messageTypeFilter, setMessageTypeFilter] = useState<MessageTypeFilter>(
    {
      showBot: true,
      showCustomer: true,
      showBusiness: true,
      showDeleted: false,
    }
  );

  // First make groups in base of date
  const groups = useMessageGroups(messages);

  // Then we filter groups + messages
  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        // --- filtro por fecha ---
        let dateMatch = false;
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
        ) {
          dateMatch = true;
        }

        if (!dateMatch) return null;

        // --- filtro por tipo ---
        const filteredMessages = group.messages.filter((msg) => {
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

  // Loading State
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

  // Estados de error
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
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
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay mensajes para mostrar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 w-full gap-4 md:grid-cols-3">
            {messages.map((message, index) => {
              const fixDate = setMilliseconds(
                setSeconds(new Date(message.message_date), 0),
                0
              );

              return (
                <MessageCard
                  key={`${message.customer}-${fixDate}-${index}`}
                  message={message}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// Componente temporal para mostrar mensajes (lo mejoraremos después)
function MessageCard({ message }: { message: Message }) {
  const isBot = message.bot_sender;
  const isCustomer = message.sent_by_customer;
  const fixedDate = setMilliseconds(
    setSeconds(new Date(message.message_date), 0),
    0
  );

  const formattedDate = format(fixedDate, "yyyy-MM-dd HH:mm");

  return (
    <div
      className={`p-4 rounded-lg border ${
        isBot
          ? "bg-blue-50 border-blue-200"
          : isCustomer
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-sm font-medium ${
            isBot
              ? "text-blue-700"
              : isCustomer
              ? "text-green-700"
              : "text-gray-700"
          }`}
        >
          {isBot ? "🤖 Bot" : isCustomer ? "👤 Client" : "🏢 Business"}
        </span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-800">{message.message_text}</p>
      <div className="mt-2 text-xs text-gray-400">
        Cliente #{message.customer} • {message.platform}
      </div>
    </div>
  );
}
