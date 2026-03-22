const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

async function run() {
  try {
    // 1. Authenticate to get token
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      username: "italianinteriors93@gmail.com", 
      password: "Password@123" 
    });
    const token = loginRes.data.token;
    if (!token) throw new Error("Login failed");

    // 2. Fetch images
    const listRes = await axios.get("http://localhost:5000/api/upload");
    const files = listRes.data;
    console.log("Found files:", files.map(f => f.name));

    // 3. Delete those containing "media" (case insensitive)
    for (const file of files) {
      if (file.name.toLowerCase().includes("media")) {
        console.log(`Deleting ${file.name}...`);
        const delRes = await axios.delete(`http://localhost:5000/api/upload/${encodeURIComponent(file.name)}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        console.log(delRes.data);
      }
    }

    // 4. Upload new images
    const paths = [
      { p: "C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\bedroom_1773837902637.png", cat: "Bedroom" },
      { p: "C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\kitchen_1773837926604.png", cat: "Kitchen" }
    ];

    for (const item of paths) {
      const form = new FormData();
      form.append("file", fs.createReadStream(item.p));
      form.append("category", item.cat);
      
      console.log(`Uploading ${item.p}...`);
      const uploadRes = await axios.post("http://localhost:5000/api/upload", form, {
        headers: {
          "Authorization": `Bearer ${token}`,
          ...form.getHeaders()
        }
      });
      console.log(uploadRes.data);
    }

    console.log("Done");
  } catch(e) {
    if (e.response && e.response.data) {
      console.error(e.response.data);
    } else {
      console.error(e);
    }
  }
}

run();
