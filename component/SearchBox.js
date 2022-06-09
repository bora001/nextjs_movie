import { useState, useRef } from "react";
import styles from "../styles/nav.module.css";
import Router from "next/router";

export default function SearchBox() {
  const inputValue = useRef();
  const [inputVisible, setInputVisible] = useState(false);

  const searchMovie = async (e) => {
    e.preventDefault();
    const query = inputValue.current.value;

    if (query.length > 0) {
      Router.push({
        pathname: `/search/movie`,
        query: { query },
      });
      inputValue.current.value = "";
    }
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputValue && inputValue.current.focus();
    }, 1100);
  };

  const hideInput = () => {
    const query = inputValue.current.value;
    query.length > 0 ? setInputVisible(true) : setInputVisible(false);
  };

  return (
    <form className={styles.input_box} onSubmit={searchMovie}>
      <input
        type="text"
        // className={styles.input_visible}
        className={inputVisible ? `${styles.input_visible}` : ""}
        ref={inputValue}
        onMouseLeave={hideInput}
      />
      <button onMouseOver={showInput}>search</button>
    </form>
  );
}
