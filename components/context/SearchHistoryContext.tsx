"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SEARCH_HISTORY_KEY = "searchHistory";

type SearchHistoryContextType = {
  history: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
};

const SearchHistoryContext = createContext<SearchHistoryContextType | null>(
  null
);

export const SearchHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {
        console.error("Invalid search history data in localStorage");
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addSearch = (query: string) => {
    if (!query.trim()) return;
    setHistory((prev) => (prev.includes(query) ? prev : [query, ...prev]));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return (
    <SearchHistoryContext.Provider value={{ history, addSearch, clearHistory }}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  if (!context)
    throw new Error(
      "useSearchHistory must be used within a SearchHistoryProvider"
    );
  return context;
};
