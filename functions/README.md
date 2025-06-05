# 🚀 Adding a New Firebase Cloud Function

This guide explains how to create, deploy, and use a new Firebase Cloud Function in this project.

---

## 📁 Project Structure

Functions are located in the `functions/src/` directory.

---

## 🛠️ Step 1: Create the Function

Add your function to `functions/src/index.ts`, or a separate module file if your project is modular.

### Callable Function

```ts
import { https } from "firebase-functions";

export const myNewFunction = https.onCall(async (data, context) => {
  // Your logic here
});
```

### HTTP Function

```ts
import { https } from "firebase-functions";

export const myNewHttpFunction = https.onRequest((req, res) => {
  // Your logic here
});
```

---

## 🧾 Step 2: Export the Function

Ensure your function is exported in `functions/src/index.ts`:

```ts
exports.myNewFunction = myNewFunction;
```

---

## 🚀 Step 3: Deploy the Function

In your project root, run:

```bash
# Deploy a single function
firebase deploy --only functions:myNewFunction

# Or deploy all functions
firebase deploy --only functions
```

---

## 🔗 Step 4: Use the Function in Your App

### Callable Function (Client-side Usage)

```ts
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const myNewFunction = httpsCallable(functions, "myNewFunction");

const result = await myNewFunction({ key: "value" });
```

---

## 🔐 Step 5: Update Security Rules (If Needed)

If your function interacts with Firestore or Storage, ensure the appropriate access rules are defined in:

- `firestore.rules`
- `storage.rules`

---

## 🧪 Step 6: Test the Function

### Run Locally

```bash
firebase emulators:start
```

### View Logs

```bash
firebase functions:log
```

Or view logs in the Firebase Console under **Functions > Logs**.

---

## ✅ Summary Checklist

- [x] Create the function
- [x] Export it in `index.ts`
- [x] Deploy with `firebase deploy`
- [x] Use it in the frontend
- [x] Update Firestore/Storage rules if needed
- [x] Test with emulator or in production
- [x] Monitor logs
