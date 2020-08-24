import React, { ButtonHTMLAttributes } from "react";

import "./styles.css";

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`button ${disabled ? "btn-disabled" : ""}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
