import { Message } from "@/types/MessagesProps";
import { MessageGroup } from "@/types/FiltersProps";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

export function getDateLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const cutoffDate = new Date("2025-06-15");

  const grouped = messages.reduce((acc, message) => {
    const messageDate = new Date(message.message_date);
    const dateKey = format(messageDate, "MM-dd-yyyy"); // MM-dd-yyyy

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);

    return acc;
  }, {} as Record<string, Message[]>);

  const groups: MessageGroup[] = Object.entries(grouped).map(
    ([dateKey, messages]) => {
      // Parse seguro con MM-dd-yyyy
      const [month, day, year] = dateKey.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      return {
        date: dateKey,
        label: getDateLabel(date),
        messages: messages.sort(
          (a, b) =>
            new Date(a.message_date).getTime() -
            new Date(b.message_date).getTime()
        ),
        isRecent: date >= cutoffDate,
        isOlder: date < cutoffDate,
      };
    }
  );

  // Ordenar grupos más recientes primero
  return groups.sort((a, b) => {
    const [am, ad, ay] = a.date.split("-").map(Number);
    const [bm, bd, by] = b.date.split("-").map(Number);
    const dateA = new Date(ay, am - 1, ad);
    const dateB = new Date(by, bm - 1, bd);
    return dateB.getTime() - dateA.getTime();
  });
}

// Hook
export function useMessageGroups(messages: Message[]): MessageGroup[] {
  return groupMessagesByDate(messages);
}
