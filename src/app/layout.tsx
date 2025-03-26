import type { Metadata } from "next";
import { Providers } from "./provider/NextUIProvider";
import { Kanit } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import QueryClientProvider from "@/lib/react-query/QueryClientProvider";

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  style: ["normal"],
  subsets: ["latin", "latin-ext", "thai"],
});

export const metadata: Metadata = {
  title: "AROM",
  description: "How was your 'AROM' today?",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  const defaultOpen = "true";

  return (
    <html lang="en">
      <body className={kanit.className}>
        <div>
          <QueryClientProvider>
            <SidebarProvider defaultOpen={true} >
            <div className='flex justify-center max-h-[calc(100vh)] overflow-hidden'>
              <AppSidebar />
            </div>
              <main className='w-screen overflow-y-scroll max-h-[calc(100vh)]'>
                <Providers>{children}</Providers>
              </main>
            </SidebarProvider>
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}
