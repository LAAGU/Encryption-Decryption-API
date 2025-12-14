const express = require("express");
const crypto = require("crypto");

const app = express();
const webcrypto = crypto.webcrypto;

app.use(express.json());

const enc = new TextEncoder();
const dec = new TextDecoder();

// converts buffer to base64 string
function bufferToBase64(buf) {
  return Buffer.from(buf).toString("base64");
}

// converts base64 string to buffer
function base64ToBuffer(b64) {
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

// derives a fixed 256-bit AES key from user-provided key
async function getKey(userKey) {
  const hashedKey = crypto
    .createHash("sha256")
    .update(userKey)
    .digest();

  return webcrypto.subtle.importKey(
    "raw",
    hashedKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

// encrypt
async function encrypt(text, userKey) {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(userKey);

  const encrypted = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(text)
  );

  return {
    iv: bufferToBase64(iv),
    data: bufferToBase64(encrypted),
  };
}

// decrypt
async function decrypt(payload, userKey) {
  const key = await getKey(userKey);

  const decrypted = await webcrypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBuffer(payload.iv),
    },
    key,
    base64ToBuffer(payload.data)
  );

  return dec.decode(decrypted);
}

// routes
app.post("/enc", async (req, res) => {
  try {
    const { data, key } = req.body;

    if (!data || !key) {
      return res.status(400).json({ error: "Missing data or key" });
    }

    const encrypted = await encrypt(data, key);
    res.json(encrypted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /dec
// body: { "iv": "...", "data": "...", "key": "my-secret-key" }

app.post("/dec", async (req, res) => {
  try {
    const { iv, data, key } = req.body;

    if (!iv || !data || !key) {
      return res.status(400).json({ error: "Missing iv, data, or key" });
    }

    const decrypted = await decrypt({ iv, data }, key);
    res.json({ data: decrypted });
  } catch {
    res.status(400).json({ error: "Invalid data or wrong key" });
  }
});


app.listen(3000, () => {
  console.log("API running on port 3000");
});

