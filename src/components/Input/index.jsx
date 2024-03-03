import './index.css'

export default function Input({ children, placeholder, hint, id }) {
    return (
        <div className="input-wrapper">
          <span>
            <label>{children}</label>
            <input autoComplete="off" type="text" placeholder={placeholder} id={id} />
          </span>
          <label className="input-hint">{hint}</label>
        </div>
    );
}