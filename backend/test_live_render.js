// import fetch from "node-fetch";

// async function testLiveBackend() {
//     try {
//         console.log("Testing live Render backend API endpoint...");
//         const res = await fetch("https://smart-url-shortener-backend-pixb.onrender.com/user/send-verification-code", {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ email: "diptipriya657@gmail.com" })
//         });
//         const data = await res.json();
//         console.log("Live Render Backend Response Status:", res.status);
//         console.log("Live Render Backend Response Data:", data);
//     } catch (err) {
//         console.error("Live test failed:", err);
//     }
// }

// testLiveBackend();

import fetch from "node-fetch";
async function testLiveBackend() {
    try {
        console.log("Testing live Render backend API endpoint...");
        const res = await fetch("https://smart-url-shortener-backend-pixb.onrender.com/user/send-verification-code", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "diptipriya657@gmail.com" })
        });
        const data = await res.json();
        console.log("Live Render Backend Response Status:", res.status);
        console.log("Live Render Backend Response Data:", data);
    } catch (err) {
        console.error("Live test failed:", err);
    }
}
testLiveBackend();