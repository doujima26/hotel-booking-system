import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />

          <main style={{ flex: 1 }}>
            <div className="pageContainer">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}