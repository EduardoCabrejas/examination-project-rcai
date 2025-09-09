import { Message } from "@/types/MessagesProps";
import { MessageGroup } from "@/types/FiltersProps";

export function getDateLabel(date: Date, today: Date): string {
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return "This Week";
  } else if (diffDays <= 14) {
    return "Last Week";
  } else if (date.getFullYear() === today.getFullYear()) {
    // Mismo año: "15 de Junio"
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  } else {
    // Año diferente: "15 de Junio 2024"
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}

export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset at midnight for accurate comparisons

  // Grouping by date (string YYYY-MM-DD)
  const grouped = messages.reduce((acc, message) => {
    const messageDate = new Date(message.message_date);
    const dateKey = messageDate.toISOString().split("T")[0]; // "2025-06-01"

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);

    return acc;
  }, {} as Record<string, Message[]>);

  // Convert to an array of MessageGroup and add labels
  const groups: MessageGroup[] = Object.entries(grouped).map(
    ([dateKey, messages]) => {
      const date = new Date(dateKey + "T00:00:00");
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        date: dateKey,
        label: getDateLabel(date, today),
        messages: messages.sort(
          (a, b) =>
            new Date(a.message_date).getTime() -
            new Date(b.message_date).getTime()
        ), // Sort messages into the group by hour
        isToday: diffDays === 0,
        isYesterday: diffDays === 1,
        isThisWeek: diffDays <= 7,
      };
    }
  );

  // Sort groups by dates (recentlier first)
  return groups.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Hook for use the grouping
export function useMessageGroups(messages: Message[]): MessageGroup[] {
  return groupMessagesByDate(messages);
}
