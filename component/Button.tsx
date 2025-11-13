import styles from "../styles/common.module.css";
const Button = ({
  onClick,
  text,
  disabled = false,
  className,
}: {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  className?: any;
}) => {
  return (
    <button
      className={`${className} ${styles.button}`}
      onClick={onClick}
      aria-label={text}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
