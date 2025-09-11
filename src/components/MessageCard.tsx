import { Message } from "@/types/MessagesProps";
import { setMilliseconds, setSeconds, format } from "date-fns";

export function MessageCard({ message }: { message: Message }) {
  const isBot = message.bot_sender;
  const isCustomer = message.sent_by_customer;

  const fixedDate = setMilliseconds(
    setSeconds(new Date(message.message_date), 0),
    0
  );

  const formattedDate = format(fixedDate, "MM-dd-yyyy HH:mm");

  return (
    <section
      role="article"
      aria-label={`${
        message.bot_sender
          ? "Bot Message"
          : message.sent_by_customer
          ? "Client Message"
          : "Business Message"
      }: ${message.message_text}`}
      className={`p-4 rounded-lg border ${
        isBot
          ? "bg-blue-50 border-blue-200"
          : isCustomer
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-sm font-medium ${
            isBot
              ? "text-blue-700"
              : isCustomer
              ? "text-green-700"
              : "text-gray-700"
          }`}
        >
          {isBot ? "🤖 Bot" : isCustomer ? "👤 Client" : "🏢 Business"}
        </span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-800">{message.message_text}</p>
      <div className="mt-2 text-xs text-gray-400">
        Cliente #{message.customer} • {message.platform}
      </div>
    </section>
  );
}
