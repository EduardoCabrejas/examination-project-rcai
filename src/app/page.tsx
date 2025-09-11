"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { setMilliseconds, setSeconds } from "date-fns";
import { ArrowDown, ArrowUp, RefreshCcwIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const isAtBottom = useRef(true);
  const messageRefs = useRef<HTMLDivElement[]>([]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Detect scroll to bottom
  const onScroll = () => {
    const scrollContainer = document.documentElement;
    const bottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      window.innerHeight;
    isAtBottom.current = bottom < 50;
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-scroll on new messages if at bottom
  useEffect(() => {
    if (isAtBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Keyboard navigation + copy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!messageRefs.current.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next =
            prev === null
              ? 0
              : Math.min(prev + 1, messageRefs.current.length - 1);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0);
          return next;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex !== null) {
          const msgDiv = messageRefs.current[activeIndex];
          if (msgDiv) {
            const text = msgDiv.dataset.messageText;
            if (text) navigator.clipboard.writeText(text);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // Focus active message
  useEffect(() => {
    if (activeIndex !== null) {
      const el = messageRefs.current[activeIndex];
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  const renderedMessageKeys = useRef<Set<string>>(new Set());
  const renderedGroupKeys = useRef<Set<string>>(new Set());
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

  const groups = useMessageGroups(messages);

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        const anyDateFilterActive = Object.values(dateFilter).some(Boolean);
        let dateMatch = true;
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
        if (!filteredMessages.length) return null;
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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Messages...</p>
        </div>
      </div>
    );
  }

  // Error
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
    <div className="min-h-screen bg-blue-100">
      <div id="messagesStart" ref={messagesStartRef} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
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

      {/* Main */}
      <main
        className="max-w-4xl mx-auto px-4 py-6"
        role="log"
        aria-live="polite"
      >
        {filteredGroups.length === 0 ? (
          <p>No hay mensajes</p>
        ) : (
          <AnimatePresence>
            {filteredGroups.map((group) => {
              const groupKey = group.date;
              const isNewGroup = !renderedGroupKeys.current.has(groupKey);
              renderedGroupKeys.current.add(groupKey);
              return (
                <motion.div
                  key={groupKey}
                  initial={isNewGroup ? "hidden" : "visible"}
                  animate="visible"
                  exit="exit"
                >
                  <div>{group.label}</div>
                  <div className="space-y-4 mt-2">
                    {group.messages.map((message, index) => {
                      const fixDate = setMilliseconds(
                        setSeconds(new Date(message.message_date), 0),
                        0
                      );
                      const motionKey = `${message.business_id}-${fixDate}`;
                      const isNewMessage =
                        !renderedMessageKeys.current.has(motionKey);
                      renderedMessageKeys.current.add(motionKey);

                      return (
                        <motion.div
                          key={motionKey}
                          ref={(el) => {
                            messageRefs.current[index] = el!;
                          }}
                          tabIndex={0}
                          data-message-text={message.message_text}
                          initial={isNewMessage ? "hidden" : "visible"}
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                        >
                          <MessageCard message={message} />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
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
