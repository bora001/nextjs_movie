"use client";

import { KeyboardEvent, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/nav.module.css";
import { Search } from "lucide-react";

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const inputValue = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.current) {
      inputValue.current.value = query || "";
    }
  }, [query]);

  const searchMovie = async () => {
    const query = inputValue.current?.value;

    if (query && query.length > 0) {
      router.push(`/search/movie?query=${encodeURIComponent(query)}`);
      if (inputValue.current) {
        inputValue.current.value = "";
      }
    }
  };
  const enterKeyBoard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchMovie();
    }
  };

  return (
    <div className={styles.input_cnt}>
      <input
        onKeyDown={(e) => enterKeyBoard(e)}
        type="text"
        ref={inputValue}
        id="search_data"
        placeholder="Search movies"
      />
      <label htmlFor="search_data">
        <button
          type="button"
          aria-label="search button"
          onClick={() => searchMovie()}
        >
          <Search />
        </button>
      </label>
    </div>
  );
}
