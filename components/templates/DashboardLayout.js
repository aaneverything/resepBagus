// DashboardLayout.js
export default function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">
            <header>Header</header>
            <main>{children}</main>
            <footer>Footer</footer>
        </div>
    );
}
