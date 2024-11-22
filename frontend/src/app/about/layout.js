// app/about/layout.js
export default function AboutLayout({ children }) {
  return (
    <div>
      <header style={{ padding: "1rem", background: "#f0f0f0" }}>
        <h1>About Us</h1>
      </header>
      <main>{children}</main>
      <footer style={{ padding: "1rem", background: "#f0f0f0" }}>
        <p>&copy; 2024 My Next.js App</p>
      </footer>
    </div>
  );
}
