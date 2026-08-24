import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist( {
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
} );

const geistMono = Geist_Mono( {
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
} );

export const metadata = {
  title: "Todo Pro",
  description: "A minimal todo app with animations, themes, and drag-to-reorder",
  appleWebApp: {
    capable: true,
    title: "Todo Pro",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "screen-orientation": "portrait",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `
(function () {
  try {
    var key = "animated-todo-app:theme";
    var stored = localStorage.getItem(key);
    var theme = stored ? JSON.parse(stored) : "system";
    var isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function RootLayout ( { children } )
{
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={ { __html: themeScript } } />
      </head>
      <body
        suppressHydrationWarning
        className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }
      >
        <Providers>{ children }</Providers>
      </body>
    </html>
  );
}
