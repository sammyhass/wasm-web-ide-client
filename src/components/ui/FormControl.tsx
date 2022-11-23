import { InputHTMLAttributes } from 'react';

export function FormControl({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  onChange,
  ...rest
}: {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="form-control font-mono">
      <label className="label" htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className={`input`}
        name={name || id}
        id={id}
        {...rest}
      />
    </div>
  );
}
