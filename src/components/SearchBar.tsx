"use client";
import React, { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
}: Props) {
  const [local, setLocal] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync external -> local
  useEffect(() => setLocal(value), [value]);

  // Debounce external change for UX
  useEffect(() => {
    const t = setTimeout(() => onChange(local), 200);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div
      className="flex flex-col justify-center gap-2 max-w-4xl text-black mx-auto"
      role="search"
      aria-label="Search messages"
    >
      <label htmlFor="message-search" className="text-lg text-black">
        Search messages
      </label>
      <div className="relative flex-1">
        <input
          type="text"
          id="message-search"
          aria-label="Search messages"
          placeholder={placeholder || "Search messages..."}
          className="w-full p-2 border-2 border-blue-400 rounded focus:ring-0 focus:outline-none focus:border-blue-800"
          value={local} // <--- important
          onChange={(e) => setLocal(e.target.value)}
          onKeyUp={() => onSearch?.(local)}
          ref={inputRef}
        />
        {local && (
          <button
            aria-label="Clear search"
            title="Clear"
            onClick={() => {
              setLocal("");
              onChange("");
              onSearch?.("");
              inputRef.current?.focus();
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 z-10"
          >
            <XIcon className="w-8 h-8 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}
