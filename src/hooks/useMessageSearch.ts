// hooks/useMessageSearch.ts
import { useEffect, useMemo, useState } from "react";
import { Message } from "@/types/MessagesProps";
import { MessageGroup } from "@/types/FiltersProps";

// formatea YYYY-MM-DD a MM-dd-yyyy
function formatDateKey(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

function getGroupLabel(dateKey: string) {
  // dateKey llega como MM-dd-yyyy
  const [mm, dd, yyyy] = dateKey.split("-");
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((today.getTime() - d.getTime()) / (24 * 3600 * 1000));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "This Week";

  // fallback: devolver en-US siempre (MM-dd-yyyy)
  return dateKey;
}

export function useMessageSearch(messages: Message[], query: string) {
  const q = (query || "").trim().toLowerCase();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const grouped = useMemo<MessageGroup[]>(() => {
    const groupsMap = new Map<string, Message[]>();

    const matches = (m: Message) => {
      if (!q) return true;
      return m.message_text.toLowerCase().includes(q);
    };

    for (const m of messages) {
      if (!matches(m)) continue;
      const key = formatDateKey(m.message_date);
      if (!groupsMap.has(key)) groupsMap.set(key, []);
      groupsMap.get(key)!.push(m);
    }

    const sortedKeys = Array.from(groupsMap.keys()).sort((a, b) => {
      // ordenar descendente por fecha real
      const ad = new Date(a);
      const bd = new Date(b);
      return bd.getTime() - ad.getTime();
    });

    return sortedKeys.map((k) => ({
      date: k,
      label: getGroupLabel(k),
      messages: groupsMap.get(k)!,
      isToday: getGroupLabel(k) === "Today",
      isYesterday: getGroupLabel(k) === "Yesterday",
      isThisWeek: getGroupLabel(k) === "This Week",
      isRecent: ["Today", "Yesterday", "This Week"].includes(getGroupLabel(k)),
      isOlder: !["Today", "Yesterday", "This Week"].includes(getGroupLabel(k)),
    }));
  }, [messages, q]);

  const flatList = useMemo(() => {
    const arr: { groupIndex: number; msgIndex: number; message: Message }[] =
      [];
    grouped.forEach((g, gi) =>
      g.messages.forEach((m, mi) =>
        arr.push({ groupIndex: gi, msgIndex: mi, message: m })
      )
    );
    return arr;
  }, [grouped]);

  useEffect(() => {
    setActiveIndex(flatList.length > 0 ? 0 : null);
  }, [query, messages, flatList.length]);

  const focusNext = () => {
    if (flatList.length === 0) return;
    setActiveIndex((prev) =>
      prev == null ? 0 : Math.min(prev + 1, flatList.length - 1)
    );
  };

  const focusPrev = () => {
    if (flatList.length === 0) return;
    setActiveIndex((prev) => (prev == null ? 0 : Math.max(prev - 1, 0)));
  };

  const getActive = () => (activeIndex == null ? null : flatList[activeIndex]);

  const copyActive = async () => {
    const item = getActive();
    if (!item) return false;
    try {
      await navigator.clipboard.writeText(item.message.message_text);
      return true;
    } catch {
      return false;
    }
  };

  return {
    grouped,
    flatList,
    activeIndex,
    setActiveIndex,
    focusNext,
    focusPrev,
    getActive,
    copyActive,
  };
}
