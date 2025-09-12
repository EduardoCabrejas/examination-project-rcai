"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowDown, ArrowUp, RefreshCcwIcon } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import FiltersBar from "@/components/FiltersBar";
import GenericButton from "@/ui/GenericButton";
import { useMessageFilters } from "@/hooks/useMessageFilters";
import { useMessageNavigation } from "@/hooks/useMessageNavigation";
import SearchBar from "@/components/SearchBar";
import MessageGroupList from "@/components/MessageGroupList";

export default function MessagesPage() {
  const { messages, loading, error, refetch } = useMessages();
  const [query, setQuery] = useState("");

  const {
    dateFilter,
    setDateFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    resetFilters,
    filteredGroups,
    filteredCount,
  } = useMessageFilters(messages, query);

  const messageRefs = useRef<HTMLDivElement[]>([]);
  const { activeIndex, setActiveIndex, copiedIndex, setCopiedIndex } =
    useMessageNavigation(messageRefs);

  const messagesStartRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Scroll Up
  useEffect(() => {
    messagesStartRef.current?.scrollIntoView();
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Messages...</p>
        </div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 font-semibold mb-2">
              Error loading messages
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-100 relative">
      <div id="messagesStart" ref={messagesStartRef} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Messages ({messages.length})
          </h1>
          <GenericButton
            variant="refresh"
            size="medium"
            onClick={refetch}
            icon={<RefreshCcwIcon className="w-5 h-5 text-white" />}
          >
            Update
          </GenericButton>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="p-4 border-b bg-gray-50">
        <SearchBar value={query} onChange={setQuery} onSearch={setQuery} />
        <FiltersBar
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          messageTypeFilter={messageTypeFilter}
          onMessageTypeFilterChange={setMessageTypeFilter}
          totalMessages={messages.length}
          filteredMessages={filteredCount}
          onReset={resetFilters}
        />
      </div>

      {/* Main */}
      <main
        className="flex flex-col justify-center mx-auto max-w-4xl outline-none"
        role="region"
        aria-label="Message List"
        tabIndex={0}
      >
        <MessageGroupList
          groups={filteredGroups}
          messageRefs={messageRefs}
          activeIndex={activeIndex}
          copiedIndex={copiedIndex}
          query={query}
          setActiveIndex={setActiveIndex}
          setCopiedIndex={setCopiedIndex}
        />
      </main>

      {/* Jump buttons */}
      <div className="flex flex-col gap-2 fixed right-2 top-32 md:bottom-8 md:top-auto z-50">
        <GenericButton
          variant="jump"
          size="xSmall"
          spanClassName="ms-3"
          to="messagesStart"
          icon={<ArrowUp className="w-5 h-5 text-white" />}
        >
          Go Top
        </GenericButton>
        <GenericButton
          variant="jump"
          size="xSmall"
          to="messagesEnd"
          icon={<ArrowDown className="w-5 h-5 text-white" />}
        >
          Go Bottom
        </GenericButton>
      </div>

      <div id="messagesEnd" ref={messagesEndRef} />
    </div>
  );
}
