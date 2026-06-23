import "./globals.css";

export const metadata = {
  title: "SnapKey",
  description: "Event Fotos einfach teilen",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
