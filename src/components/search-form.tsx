"use client";

import { useSearchContext } from "@/lib/hooks";

type Props = {};

const SearchForm = (props: Props) => {
  const { search, setSearch } = useSearchContext();

  return (
    <form className="w-full h-full">
      <input
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none 
      transition focus:bg-white/50 hover:bg-white/50 placeholder:text-white/50"
        placeholder="Search pets"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default SearchForm;
