// app/about/page.js
export default function AboutPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to the About Page</h2>
      <p>
        This is the about page of our Next.js application. Here, you can learn
        more about our mission, vision, and team.
      </p>
      <h3>Our Mission</h3>
      <p>
        To build high-quality, scalable, and modern web applications using
        cutting-edge technologies.
      </p>
      <h3>Our Team</h3>
      <ul>
        <li>John Doe - Founder & CEO</li>
        <li>Jane Smith - Lead Developer</li>
        <li>Alex Johnson - UX/UI Designer</li>
      </ul>
    </div>
  );
}
