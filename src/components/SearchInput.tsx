
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  onSearch,
  className,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  // Clear search input
  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply the initial query if provided
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
      onSearch(initialQuery);
    }
  }, [initialQuery, onSearch]);

  return (
    <div
      className={cn(
        "relative flex items-center",
        isFocused ? "ring-1 ring-ring" : "",
        className
      )}
    >
      <div className="glass rounded-lg flex items-center w-full overflow-hidden border border-border transition-colors duration-200">
        <div className="flex items-center justify-center w-10 h-10 text-muted-foreground">
          <Search size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-10 bg-transparent border-0 outline-none text-sm px-2 text-black dark:text-white"
        />
        {query && (
          <button
            onClick={handleClear}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {!query && (
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
