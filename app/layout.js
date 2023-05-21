// "use client";
import Provider from "@/components/provider";
import "@/styles/globals.css";

export const metadata = {
  title: "Algolink",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
