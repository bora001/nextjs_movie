import { useState, useRef } from "react";
import Router from "next/router";
import styles from "../styles/nav.module.css";
import { MdOutlineSearch } from "react-icons/md";

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
        className={inputVisible ? `${styles.input_visible}` : ""}
        ref={inputValue}
        onMouseLeave={hideInput}
        id="search_data"
      />
      <label htmlFor="search_data">
        <button aria-label="search button">
          <MdOutlineSearch color="white" onMouseOver={showInput} />
        </button>
      </label>
    </form>
  );
}
