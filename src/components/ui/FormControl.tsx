export function FormControl({
  id,
  label,
  name,
  type = 'text',
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="form-control font-mono">
      <label className="label" htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input`}
        name={name || id}
        id={id}
      />
    </div>
  );
}
