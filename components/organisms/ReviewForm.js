// ReviewForm.js
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function ReviewForm({ onSubmit }) {
    return (
        <form className="review-form" onSubmit={onSubmit}>
            <Input type="text" placeholder="Your Review" />
            <Button>Submit</Button>
        </form>
    );
}
