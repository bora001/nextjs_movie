import "../styles/globals.css";
import { useStore } from "react-redux";
import { wrapper } from "../store/index";
import { PersistGate } from "redux-persist/integration/react";

export default wrapper.withRedux(({ Component, pageProps }) => {
  const store = useStore();
  return (
    <PersistGate persistor={store} loading={<Component {...pageProps} />}>
      <Component {...pageProps} />
    </PersistGate>
  );
});
