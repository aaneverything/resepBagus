// SearchBar.js
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function SearchBar({ value, onChange, onSearch }) {
    return (
        <div className="search-bar">
            <Input type="text" placeholder="Search..." value={value} onChange={onChange} />
            <Button onClick={onSearch}>Search</Button>
        </div>
    );
}
