import { Message } from "@/types/MessagesProps";
import { setMilliseconds, setSeconds, format } from "date-fns";
import { Copy, Users2, Bot, Briefcase } from "lucide-react";
import { useState } from "react";

export function MessageCard({ message }: { message: Message }) {
  const isBot = message.bot_sender;
  const isCustomer = message.sent_by_customer;
  const [copied, setCopied] = useState(false);

  const fixedDate = setMilliseconds(
    setSeconds(new Date(message.message_date), 0),
    0
  );

  const formattedDate = format(fixedDate, "MM-dd-yyyy HH:mm");

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const SenderIcon = isBot ? Bot : isCustomer ? Users2 : Briefcase;

  return (
    <section
      role="article"
      aria-label={`${
        isBot
          ? "Bot Message"
          : isCustomer
          ? "Client Message"
          : "Business Message"
      }: ${message.message_text}`}
      className={`p-4 rounded-lg border relative ${
        isBot
          ? "bg-blue-100 border-2 border-blue-400"
          : isCustomer
          ? "bg-green-100 border-2 border-green-400"
          : "bg-gray-200 border-2 border-gray-400"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        {/* Sender info */}
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <SenderIcon
            className={`w-4 h-4 ${
              isBot
                ? "text-blue-700"
                : isCustomer
                ? "text-green-700"
                : "text-gray-700"
            }`}
          />
          <span
            className={`${
              isBot
                ? "text-blue-700"
                : isCustomer
                ? "text-green-700"
                : "text-gray-700"
            }`}
          >
            {isBot ? "Bot" : isCustomer ? "Client" : "Business"}
          </span>
        </div>

        {/* Date + Copy button */}
        <div className="flex items-center gap-2 relative">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <div className="relative">
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-blue-200 rounded"
              title="Copy message"
            >
              <Copy className="w-4 h-4 text-gray-500" />
            </button>

            {/* Pop-up "Copied!" */}
            {copied && (
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-800">{message.message_text}</p>
      <div className="mt-2 text-xs text-black font-bold">
        Cliente #{message.customer} • {message.platform}
      </div>
    </section>
  );
}
