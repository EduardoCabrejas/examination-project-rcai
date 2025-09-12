import { MessageGroup } from "@/types/FiltersProps";

export interface MessageGroupListProps {
  groups: MessageGroup[];
  messageRefs: React.MutableRefObject<HTMLDivElement[]>;
  activeIndex: number | null;
  copiedIndex: number | null;
  query: string;
  setActiveIndex: (index: number) => void;
  setCopiedIndex: (index: number | null) => void;
}
