// Button.js
export default function Button({ children, onClick }) {
    return (
        <button onClick={onClick} className="btn">
            {children}
        </button>
    );
}
