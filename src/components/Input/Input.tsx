import * as React from "react";
import { Controller, useFormContext, ValidateResult } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { twMerge } from "tw-merge";
import clsx from "clsx";

/**
 * @typedef {Object} MultilineConfig
 * @property {number} [staticRow] - Number of rows for the multiline Input component.
 * @property {boolean} [flexible] - Whether the multiline Input component is flexible with maxRows.
 */

/**
 * @typedef {Object} InputProps
 * @property {Record<string, any>} [sx] - custom style for the Input component
 * @property {string} label - label for the Input component
 * @property {string} name - name of the Input component (used for form control)
 * @property {"text" | "password" | "email" | "number" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week" | "color"} [type] - type of the Input component
 * @property {"outlined" | "filled" | "standard"} [variant] - variant of the Input component
 * @property {"small" | "medium"} [size] - size of the Input component
 * @property {boolean} [disabled] - whether the Input component is disabled
 * @property {boolean} [readOnly] - whether the Input component is read-only
 * @property {number} [minLength] - minimum length of the Input component
 * @property {number} [maxLength] - maximum length of the Input component
 * @property {boolean} [fullWidth] - whether the Input component is full width
 * @property {{ value: RegExp; message: string; }} [pattern] - The regular expression pattern for the Input component
 * @property {(value: any) => ValidateResult | Promise<ValidateResult>} [customValidation] - custom validation function for the Input component
 * @property {boolean} [required] - whether the Input component is required
 * @property {string} [defaultValue] - default value for the Input component
 * @property {Object} [multiline] - multiline configuration for the Input component
 * @property {number} [multiline.staticRow] - number of rows for the multiline Input component. If provided, the Input component will be multiline for a fixed number of rows.
 * @property {boolean} [multiline.flexible] - whether the multiline Input component is flexible. If provided, the Input component will be multiline with a flexible number of rows (1 to maxRows).
 * @property {string | React.ReactElement} [startIcon] - icon or text to display at the start of the Input component
 * @property {string | React.ReactElement} [endIcon] - icon or text to display at the end of the Input component
 * @property {"on" | "off"} [autoComplete] - whether the Input component should have autocomplete enabled
 * @property {string} [className] - User defined tailwind classes to override default mui classes
 */

/**
 * A wrapper around the Material-UI TextField component that integrates with react-hook-form for a better validation.
 * @param {InputProps} props - The props of the Input component
 * @returns {JSX.Element} - The JSX element of the Input component
 */

export type InputProps = {
  sx?: Record<string, any>;
  label: string;
  name: string;
  /**
   * @param {{type: "text" | "password" | "email" | "number" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week" | "color"}}
   */
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color";
  /**
   * @param {{variant: "outlined" | "filled" | "standard"}}
   */
  variant?: "outlined" | "filled" | "standard";
  /**
   * @param {{size: "small" | "medium"}}
   */
  size?: "small" | "medium";
  disabled?: boolean;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  fullWidth?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  customValidation?: (value: any) => ValidateResult | Promise<ValidateResult>;
  required?: boolean;
  defaultValue?: string;
  multiline?: any;
  startIcon?: string | React.ReactElement;
  endIcon?: string | React.ReactElement;
  /**
   * @param {{autoComplete: "on" | "off"}}
   */
  autoComplete?: "on" | "off";
  /**
   * @param {string} [className] - User-defined Tailwind classes to override default Material-UI classes.
   */
  className?: string;
};

function Input({
  sx,
  type,
  label,
  name,
  variant,
  size,
  disabled,
  readOnly,
  minLength = 0,
  maxLength = 150,
  fullWidth,
  pattern,
  customValidation,
  required,
  defaultValue,
  multiline,
  startIcon,
  endIcon,
  autoComplete,
  className,
}: InputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPasswordClick = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  const muiDefaultClasses = twMerge(
    clsx(
      // MUI classes first
      "MuiTextField-root",
      variant === "outlined" ? "MuiOutlinedInput-root" : "",
      variant === "filled" ? "MuiFilledInput-root" : "",
      variant === "standard" ? "MuiInput-root" : "",
      disabled ? "Mui-disabled" : "",
      errors[name] ? "Mui-error" : "",
      // Tailwind classes last
      className // Tailwind classes should be at the end
    )
  );

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue || ""}
      rules={{
        required: required && `${label} is required`,
        minLength: minLength && {
          value: minLength,
          message: `${label} must be at least ${minLength} characters`,
        },
        maxLength: maxLength && {
          value: maxLength,
          message: `${label} must not exceed ${maxLength} characters`,
        },
        pattern: pattern && {
          value: pattern.value,
          message: pattern.message,
        },
        validate: customValidation,
      }}
      render={({ field }) => (
        <TextField
          sx={sx}
          type={showPassword && type === "password" ? "text" : type || "text"}
          disabled={disabled}
          {...field}
          id={name}
          label={label}
          fullWidth={fullWidth}
          variant={variant || "outlined"}
          size={size || "small"}
          value={field.value || ""}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          onBlur={field.onBlur}
          required={required}
          autoComplete={autoComplete}
          multiline={!!multiline}
          {...(multiline?.staticRow && { rows: multiline.staticRow })}
          {...(multiline?.flexible && { maxRows: multiline.flexible })}
          InputProps={{
            readOnly,
            ...(startIcon && {
              startAdornment: (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              ),
            }),
            ...(endIcon && {
              endAdornment: (
                <InputAdornment position="end">
                  {type === "password" ? (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPasswordClick}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ) : (
                    endIcon
                  )}
                </InputAdornment>
              ),
            }),
          }}
          className={muiDefaultClasses}
        />
      )}
    />
  );
}

export { Input };
