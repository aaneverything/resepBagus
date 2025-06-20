// Modal.js
export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">&times;</button>
                {children}
            </div>
        </div>
    );
}
