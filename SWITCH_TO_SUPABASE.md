# Switching from Firebase to Supabase

## Why Switch to Supabase?

| Feature | Firebase | Supabase |
|---------|----------|----------|
| **Database** | NoSQL (Firestore) | PostgreSQL (SQL) |
| **Authentication** | Google-managed | Built-in, customizable |
| **Storage** | Cloud Storage | S3-compatible |
| **Real-time** | ✅ Yes | ✅ Yes |
| **Cost** | Pay-per-use | Generous free tier |
| **Open Source** | ❌ No | ✅ Yes |
| **Self-hosting** | ❌ No | ✅ Yes |
| **SQL Queries** | ❌ No | ✅ Yes |
| **Free Tier** | Limited | Very generous |
| **Cold starts** | Minimal | None |

**Choose Supabase if you want:**
- ✅ More control over your data
- ✅ SQL queries
- ✅ Lower costs
- ✅ Open-source solution
- ✅ Self-hosting option

---

## Step 1: Create Supabase Project

### 1.1 Go to Supabase
```
https://supabase.com → Sign up (free)
```

### 1.2 Create New Project
- Click "New Project"
- Project name: `gleamia`
- Database password: Create strong password
- Region: Choose closest to you
- Click "Create new project"

### 1.3 Wait for Project Creation
- Takes 1-2 minutes
- You'll get your database credentials

---

## Step 2: Get Supabase Credentials

### 2.1 Navigate to Project Settings
- Click the gear icon ⚙️
- Click "API" in left sidebar
- You'll see:
  - Project URL
  - Public API Key (anon key)
  - Service Role Key (never share this)

### 2.2 Copy Your Credentials
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Update Environment Variables

### 3.1 Create/Update `.env.local`
```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

---

## Step 5: Create Supabase Client

### 5.1 Create `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Step 6: Create Database Tables

### 6.1 Go to Supabase Dashboard
- Click "SQL Editor"
- Click "New Query"

### 6.2 Create "users" Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: users can see their own data
CREATE POLICY "users_can_view_own_data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 6.3 Create "products" Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER,
  category TEXT,
  material TEXT,
  gemstone TEXT,
  weight DECIMAL(10, 2),
  rating DECIMAL(3, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_view_products" ON products
  FOR SELECT USING (true);

CREATE POLICY "only_admins_can_modify_products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### 6.4 Create "reviews" Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_view_reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "authenticated_users_can_create_reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);
```

### 6.5 Create "orders" Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_date TIMESTAMP DEFAULT NOW(),
  total_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered
  shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_view_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_create_orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 6.6 Run All Queries
- Paste each query above into SQL Editor
- Click "Run" for each one

---

## Step 7: Update Login Page

### 7.1 Replace Firebase with Supabase

File: `app/login/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Get user role from database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      if (userError) {
        setError("Failed to fetch user role");
        setLoading(false);
        return;
      }

      const userRole = userData?.role || "user";

      // Route based on selected role and actual role
      if (role === "admin" && userRole === "admin") {
        router.push("/admin");
      } else if (role === "user") {
        router.push("/users/products");
      } else {
        setError("You don't have permission to access this role.");
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8dff5] to-[#f0ebf8] flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 border border-purple-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">Welcome Back</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
              className="w-4 h-4"
            />
            <span className="text-black font-medium">User</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
              className="w-4 h-4"
            />
            <span className="text-black font-medium">Admin</span>
          </label>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
```

---

## Step 8: Update Signup Page

File: `app/signup/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async () => {
    if (!email || !password || !displayName) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create auth account
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Create user profile in database
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: data.user?.id,
          email,
          display_name: displayName,
          role: "user",
        },
      ]);

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      // Redirect to login
      router.push("/login");
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8dff5] to-[#f0ebf8] flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 border border-purple-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">Create Account</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />
        </div>

        <button
          onClick={signup}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
```

---

## Step 9: Example - Fetch Products

### How to Fetch Data from Supabase

```typescript
// Get all products
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false });

// Get products by category
const { data: ringProducts, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'Rings');

// Get product with reviews
const { data: product, error } = await supabase
  .from('products')
  .select('*, reviews(*)')
  .eq('id', productId)
  .single();

// Search products
const { data: results, error } = await supabase
  .from('products')
  .select('*')
  .ilike('name', `%${searchTerm}%`);
```

---

## Step 10: Create Test Users

### 10.1 In Supabase Dashboard
- Click "Authentication"
- Click "Users"
- Click "Create a new user"

### 10.2 Create Users
```
Email: user@example.com
Password: Password123!

Email: admin@example.com
Password: AdminPass123!
```

### 10.3 Create User Profiles
- Go to "SQL Editor"
- Run this query:

```sql
-- Create user profile for regular user
INSERT INTO users (id, email, display_name, role) 
VALUES (
  'USER_ID_FROM_AUTH', 
  'user@example.com', 
  'Test User', 
  'user'
);

-- Create user profile for admin
INSERT INTO users (id, email, display_name, role) 
VALUES (
  'ADMIN_ID_FROM_AUTH', 
  'admin@example.com', 
  'Admin User', 
  'admin'
);
```

Get the user IDs:
1. Click "Authentication" → "Users"
2. Copy the UUID for each user
3. Replace `USER_ID_FROM_AUTH` and `ADMIN_ID_FROM_AUTH`

---

## Step 11: Enable Authentication

### 11.1 In Supabase Dashboard
- Click "Authentication"
- Click "Providers" 
- "Email" should be enabled by default
- Optional: Enable "Google", "GitHub" for social login

---

## Step 12: Update .env.local

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Step 13: Test

```bash
# Restart dev server
npm run dev

# Go to http://localhost:3000/login
# Try signing up first
# Then login with: user@example.com / Password123!
```

---

## Comparison: Firebase vs Supabase Code

### Authentication

**Firebase:**
```typescript
import { signInWithEmailAndPassword } from "firebase/auth";
const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

**Supabase:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

### Database Queries

**Firebase:**
```typescript
const docRef = doc(db, "users", userId);
const docSnap = await getDoc(docRef);
```

**Supabase:**
```typescript
const { data } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();
```

### Real-time Subscriptions

**Firebase:**
```typescript
onSnapshot(doc(db, "products", productId), (snapshot) => {
  console.log(snapshot.data());
});
```

**Supabase:**
```typescript
supabase
  .from("products")
  .on("*", (payload) => {
    console.log("Change:", payload);
  })
  .subscribe();
```

---

## Storage (Optional)

### Upload Files to Supabase Storage

```typescript
const { data, error } = await supabase.storage
  .from("products")
  .upload(`images/${Date.now()}.jpg`, file);
```

---

## Advantages of Supabase

✅ **PostgreSQL** - Familiar if you know SQL
✅ **Cheaper** - Free tier is very generous
✅ **Open Source** - Can self-host
✅ **More Control** - Direct database access
✅ **Real-time** - Built-in subscriptions
✅ **Vector Support** - For AI features

---

## Migration Complete! ✅

Your app now uses:
- ✅ Supabase Authentication
- ✅ PostgreSQL Database
- ✅ Supabase Storage (ready)
- ✅ Row-Level Security

**Total setup time: ~30 minutes**

---

## Next Steps

1. Test login/signup
2. Add products to database
3. Update product pages to fetch from Supabase
4. Test all features
5. Deploy

---

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Supabase Discord](https://discord.com/invite/bnncdgSn9V)
