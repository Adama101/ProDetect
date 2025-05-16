// src/components/BrowserOnlyComponent.jsx
// Create a component that only renders on the client side

"use client";

import { useEffect, useState } from "react";

export default function BrowserOnlyComponent() {
    const [mounted, setMounted] = useState(false);

    // This useEffect will only run on the client after the component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Early return during SSR
    if (!mounted) {
        return null; // Return nothing during server-side rendering
    }

    // Once mounted (client-side only), you can safely use window
    const userAgent = window.navigator.userAgent;
    const screenWidth = window.innerWidth;

    return (
        <div className="browser-only-component">
            <h2>Browser Information</h2>
            <p>User Agent: {userAgent}</p>
            <p>Screen Width: {screenWidth}px</p>

            {/* Add any other window-dependent content here */}
        </div>
    );
}

// Usage example in a server component:
// ----------------------------------
// import BrowserOnlyComponent from '../components/BrowserOnlyComponent';
//
// export default function MyPage() {
//   return (
//     <div>
//       <h1>Server-rendered content</h1>
//       {/* The BrowserOnlyComponent will only render on client */}
//       <BrowserOnlyComponent />
//     </div>
//   );
// }
