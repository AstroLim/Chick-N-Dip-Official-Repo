export const metadata = {
  title: "ChickNDip",
  description: "Menu and ordering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}