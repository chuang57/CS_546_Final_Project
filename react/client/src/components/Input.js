export default function Input({ name, required }) {
  return (
    <div class="input-group mb-3">
      <label className="input-group-text" for={name}>
        {name}
      </label>
      <input
        required={required}
        className="form-control"
        id={name}
        name={name}
      ></input>
    </div>
  );
}
