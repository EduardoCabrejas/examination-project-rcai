import { Message } from "./MessagesProps";

export interface MessageGroup {
  date: string;
  label: string;
  messages: Message[];
  isRecent?: boolean;
  isOlder?: boolean;
  isToday?: boolean;
  isYesterday?: boolean;
  isThisWeek?: boolean;
}

export interface DateFilter {
  showToday: boolean;
  showYesterday: boolean;
  showThisWeek: boolean;
  showOlder: boolean;
}

export interface MessageTypeFilter {
  showBot: boolean;
  showCustomer: boolean;
  showBusiness: boolean;
  showDeleted: boolean;
}

export interface FiltersBarProps {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  messageTypeFilter: MessageTypeFilter;
  onMessageTypeFilterChange: (filter: MessageTypeFilter) => void;
  totalMessages: number;
  filteredMessages: number;
  onReset: () => void;
}
