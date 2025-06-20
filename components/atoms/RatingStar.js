// RatingStar.js
export default function RatingStar({ filled }) {
    return (
        <span className={filled ? "star filled" : "star"}>★</span>
    );
}
