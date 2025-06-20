// AuthForm.js
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function AuthForm({ onSubmit }) {
    return (
        <form className="auth-form" onSubmit={onSubmit}>
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button>Login</Button>
        </form>
    );
}
