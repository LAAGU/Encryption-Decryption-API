# 🔐 Simple Encryption API (AES-GCM)

A minimal Express.js API that encrypts and decrypts text using **AES-256-GCM**.  
Users provide their own secret key, which is securely hashed and used for encryption.

## ✨ Features

- AES-256-GCM encryption (authenticated encryption)
- User-provided secret keys
- Random IV generated per encryption
- Base64-encoded output (JSON-safe)
- Simple REST API using Express

## 🛠 Tech Stack

- Node.js
- Express.js
- Web Crypto API (`crypto.webcrypto`)
- AES-GCM

## 📦 Installation

```bash
git clone <repo-url>
cd <repo-name>
npm install
node index.js
```
> Server will start on: `http://localhost:3000`

## 🚀 API Usage
### 🔒 Encrypt Data
- Endpoint
```bash
POST /enc
```

- Request Body
```json
{
  "data": "hello world",
  "key": "user-unique-secret"
}
```

- Response
```json
{
  "iv": "Q3p4Y0JkV3pYbE1N",
  "data": "rA9yM2mJZ0xQ2Xc0..."
}
```

### 🔓 Decrypt Data
- Endpoint
```bash
POST /dec
```

- Request Body
```json
{
  "iv": "Q3p4Y0JkV3pYbE1N",
  "data": "rA9yM2mJZ0xQ2Xc0...",
  "key": "user-unique-secret"
}
```

- Response
```json
{
  "data": "hello world"
}
```
> ⚠️ The same key used for encryption must be used for decryption.

## 🔐 How It Works
- The user-provided key is hashed using SHA-256 to create a fixed 256-bit key
- AES-GCM is used for encryption and authentication
- A random IV is generated for each encryption
- Binary data is encoded as Base64 to safely transmit over JSON

## ⚠️ Notes

- This project is for demonstration purposes
- Do not use as-is for production without proper validation, rate-limiting, and key management
- Always use HTTPS in real deployments
