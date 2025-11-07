"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/nav.module.css";
import { MdOutlineSearch } from "react-icons/md";

export default function SearchBox() {
  const router = useRouter();
  const inputValue = useRef<HTMLInputElement>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(false);

  const searchMovie = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputValue.current?.value;

    if (query && query.length > 0) {
      router.push(`/search/movie?query=${encodeURIComponent(query)}`);
      if (inputValue.current) {
        inputValue.current.value = "";
      }
    }
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputValue.current?.focus();
    }, 1100);
  };

  const hideInput = () => {
    const query = inputValue.current?.value;
    setInputVisible(!!(query && query.length > 0));
  };

  return (
    <form
      className={styles.input_box}
      onSubmit={searchMovie}
      onMouseLeave={hideInput}
    >
      <input
        type="text"
        className={inputVisible ? `${styles.input_visible}` : ""}
        ref={inputValue}
        id="search_data"
        placeholder="Search movies"
      />
      <label htmlFor="search_data">
        <button type="button" aria-label="search button">
          <MdOutlineSearch color="white" onMouseOver={showInput} />
        </button>
      </label>
    </form>
  );
}
