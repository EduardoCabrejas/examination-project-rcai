import { useState, useMemo } from "react";
import { useMessageGroups } from "@/utils/dateGrouping";
import {
  DateFilter,
  MessageTypeFilter,
  MessageGroup,
} from "@/types/FiltersProps";
import { Message } from "@/types/MessagesProps";

export function useMessageFilters(messages: Message[], query: string = "") {
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
    const normalizedQuery = query.trim().toLowerCase();

    return groups
      .map((group) => {
        // --- DATE FILTERS ---
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

        // --- TYPE FILTERS ---
        const anyTypeFilterActive =
          Object.values(messageTypeFilter).some(Boolean);

        let filteredMessages = group.messages.filter((msg) => {
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

        // --- SEARCH FILTER ---
        if (normalizedQuery) {
          filteredMessages = filteredMessages.filter((msg) =>
            msg.message_text.toLowerCase().includes(normalizedQuery)
          );
        }

        if (!filteredMessages.length) return null;
        return { ...group, messages: filteredMessages };
      })
      .filter((g): g is MessageGroup => g !== null);
  }, [groups, dateFilter, messageTypeFilter, query]);

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

  return {
    dateFilter,
    setDateFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    resetFilters,
    filteredGroups,
    filteredCount,
  };
}
