import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Continental.com",
  description: "Hotel Booking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="app-body">
        <AuthProvider>
          <div className="app-wrapper">

            <Header />

            <main className="page-container content-offset">
              {children}
            </main>

            <Footer />

          </div>
        </AuthProvider>
      </body>
    </html>
  );
}