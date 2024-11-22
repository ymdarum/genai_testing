import './globals.css';

export const metadata = {
  title: 'GenAI Testing Framework',
  description: 'Test and evaluate your language model responses with detailed analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
