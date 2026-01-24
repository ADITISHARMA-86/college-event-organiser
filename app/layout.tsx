import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Provider";


export const metadata = {
  title: "College Event Organiser",
  description: "AI-based College Event Organiser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900 text-white">
        <Providers>
          <Header />

          <main className="relative min-h-screen pt-32">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 min-h-[70vh]">{children}</div>

            <footer className="border-t border-gray-800/50 py-8 px-6 max-w-7xl mx-auto">
              <div className="text-sm text-gray-400">
                Made with ❤️ by AditiCoder
              </div>
            </footer>
          </main>
        </Providers>
      </body>
    </html>
  );
} 





