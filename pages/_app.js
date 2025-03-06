// pages/_app.js
import "@/styles/globals.css"; 
// globals.css harus berisi direktif Tailwind seperti @tailwind base; @tailwind components; @tailwind utilities;

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
