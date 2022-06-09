import Link from "next/link";
import { useRef } from "react";
import styles from "../styles/nav.module.css";
import Router from "next/router";

export default function SearchBox() {
  const inputValue = useRef();
  const searchMovie = async (e) => {
    e.preventDefault();
    const query = inputValue.current.value;
    Router.push({
      pathname: `/search/movie`,
      query: { query },
    });
    inputValue.current.value = "";
  };

  return (
    <form className={styles.input_box} onSubmit={searchMovie}>
      <input type="text" ref={inputValue} />
      <button>search</button>
    </form>
  );
}
