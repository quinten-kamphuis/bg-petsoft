"use client";

import { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type SearchContextType = {
  search: string;
  setSearch: (search: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

const SearchContextProvider = ({ children }: Props) => {
  const [search, setSearch] = useState<string>("");

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
