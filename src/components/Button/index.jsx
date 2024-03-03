import './index.css';

export default function Button({ children, id, onClick }) {
    return (
        <button onClick={onClick} id={id}>{children}</button>
    );
}