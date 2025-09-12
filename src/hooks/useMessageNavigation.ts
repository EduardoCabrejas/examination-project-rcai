import { useState, useEffect } from "react";

export function useMessageNavigation(
  messageRefs: React.MutableRefObject<HTMLDivElement[]>
) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Keyboard navigation + copy + deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!messageRefs.current.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, messageRefs.current.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
      } else if (
        e.key === "Enter" ||
        (e.ctrlKey && e.key.toLowerCase() === "c")
      ) {
        e.preventDefault();
        if (activeIndex !== null) {
          const msgDiv = messageRefs.current[activeIndex];
          if (msgDiv) {
            const text = msgDiv.dataset.messageText;
            if (text) {
              navigator.clipboard.writeText(text);
              setCopiedIndex(activeIndex);
              setTimeout(() => setCopiedIndex(null), 1500);
            }
          }
        }
      } else if (e.key === "Escape") {
        // Deselect with Esc
        setActiveIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, messageRefs]);

  // Click out of the message to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!messageRefs.current.some((el) => el?.contains(e.target as Node))) {
        setActiveIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [messageRefs]);

  // Focus active message
  useEffect(() => {
    if (activeIndex !== null) {
      const el = messageRefs.current[activeIndex];
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex, messageRefs]);

  return { activeIndex, setActiveIndex, copiedIndex, setCopiedIndex };
}
