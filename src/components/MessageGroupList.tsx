"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCard } from "@/components/MessageCard";
import { MessageGroupListProps } from "@/types/MessageGroupListProps";

export default function MessageGroupList({
  groups,
  messageRefs,
  activeIndex,
  copiedIndex,
  query,
  setActiveIndex,
  setCopiedIndex,
}: MessageGroupListProps) {
  let globalIndex = 0;

  return (
    <div className="my-8">
      {groups.map((group) => (
        <div key={group.date}>
          <div className="sticky top-32 md:top-20 bg-gray-50 px-2 py-1 text-gray-700 font-semibold rounded border-b-2 border-gray-500 z-10 mt-4 mb-1">
            {group.label}
          </div>

          <div className="space-y-4 relative">
            {group.messages.map((msg) => {
              const index = globalIndex++;
              return (
                <motion.div
                  key={msg.message_date + msg.customer}
                  ref={(el) => {
                    if (el) messageRefs.current[index] = el;
                  }}
                  tabIndex={0}
                  data-message-text={msg.message_text}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-3 bg-transparent rounded-lg border border-blue-400 shadow-sm cursor-pointer focus:outline-none
                    ${index === activeIndex ? "ring-2 ring-blue-500" : ""}
                    ${
                      index === copiedIndex
                        ? "bg-green-100"
                        : msg.bot_sender
                        ? "bg-blue-50 text-blue-900 self-end"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  onClick={() => setActiveIndex(index)}
                  onDoubleClick={() => {
                    navigator.clipboard.writeText(msg.message_text);
                    setCopiedIndex(index);
                    setTimeout(() => setCopiedIndex(null), 1500);
                  }}
                >
                  <MessageCard message={msg} query={query} />

                  {/* Pop-up "Copied!" */}
                  <AnimatePresence>
                    {copiedIndex === index && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-20"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <div className="text-xs text-end text-gray-600 font-bold mt-2">
                    {new Date(msg.message_date).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
