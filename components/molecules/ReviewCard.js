// ReviewCard.js
import RatingStar from "../atoms/RatingStar";

export default function ReviewCard({ reviewer, rating, comment }) {
    return (
        <div className="review-card">
            <h4>{reviewer}</h4>
            <div className="rating">
                {[...Array(5)].map((_, i) => (
                    <RatingStar key={i} filled={i < rating} />
                ))}
            </div>
            <p>{comment}</p>
        </div>
    );
}
