# Supabase Migration Complete ✅

Your Gleamia project has been successfully migrated from Firebase to Supabase! Here's what was updated:

## Updated Files

### Authentication Pages
- ✅ **app/login/page.tsx** - Uses `supabase.auth.signInWithPassword()`
- ✅ **app/signup/page.tsx** - Uses `supabase.auth.signUp()` with user profile creation
- ✅ **app/logout/page.tsx** - Uses `supabase.auth.signOut()`

### Navigation & Components
- ✅ **components/NavBar.tsx** - Uses `supabase.auth.onAuthStateChange()` for session management

### Admin Pages
- ✅ **app/admin/profile/page.tsx** - Fetches user data from Supabase
- ✅ **app/admin/orders/page.tsx** - Queries and updates orders in Supabase
- ✅ **app/admin/products/page.tsx** - Fetches products with filtering

### User Pages
- ✅ **app/users/profile/page.tsx** - Displays user profile and dashboard
- ✅ **app/users/products/page.tsx** - Lists, searches, and filters products
- ✅ **app/users/checkout/page.tsx** - Creates orders in Supabase

### Configuration
- ✅ **.env.local** - Updated with Supabase credentials
- ✅ **package.json** - Added `@supabase/supabase-js` package
- ✅ **src/lib/supabase.ts** - New Supabase client initialization

## Next Steps

### 1. Set Up Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project credentials:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Update Environment Variables
Edit `.env.local` and replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Create Database Tables
1. Go to your Supabase Dashboard → SQL Editor
2. Open the file `SUPABASE_SCHEMA.sql` in this repository
3. Copy and paste the SQL commands into the SQL Editor
4. Click "Run" to execute all queries

This will create:
- **users** table (tied to auth.users)
- **products** table
- **orders** table
- Row Level Security (RLS) policies
- Sample products (optional)

### 4. Test the Application
```bash
npm run dev
```

Visit:
- [http://localhost:3000/signup](http://localhost:3000/signup) - Create an account
- [http://localhost:3000/login](http://localhost:3000/login) - Sign in
- [http://localhost:3000/users/products](http://localhost:3000/users/products) - Browse products

### 5. Admin Setup
The first user created with email `admin@gleamia.com` will automatically have admin role. Log in to access:
- [http://localhost:3000/admin](http://localhost:3000/admin) - Admin dashboard
- [http://localhost:3000/admin/products](http://localhost:3000/admin/products) - Manage products
- [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders) - Manage orders

## Key Changes

### Firebase → Supabase Mapping
| Feature | Firebase | Supabase |
|---------|----------|----------|
| Authentication | `firebase/auth` | `supabase.auth` |
| Database | Firestore (`collection()`) | PostgreSQL (`.from()`) |
| Session Mgmt | `onAuthStateChanged()` | `onAuthStateChange()` |
| Create User | `createUserWithEmailAndPassword()` | `signUp()` |
| Sign In | `signInWithEmailAndPassword()` | `signInWithPassword()` |
| Sign Out | `signOut()` | `signOut()` |
| Query Data | `getDocs()`, `getDoc()` | `.select()`, `.single()` |
| Insert Data | `addDoc()`, `setDoc()` | `.insert()` |
| Update Data | `updateDoc()` | `.update()` |

### Database Field Naming
Supabase uses snake_case by convention:
- `imageUrl` → `image_url`
- `createdAt` → `created_at`
- `userEmail` → `user_email`

## Troubleshooting

### "Please fill in Supabase credentials"
Your `.env.local` file needs the Supabase project URL and API keys. Copy them from your Supabase dashboard.

### "User table error"
Make sure you've run the `SUPABASE_SCHEMA.sql` script in your Supabase SQL Editor to create all tables.

### "Permission denied" errors
This is likely a Row Level Security (RLS) issue. Check that the RLS policies in `SUPABASE_SCHEMA.sql` are applied.

### Product field not found
If you get "column 'imageUrl' does not exist", remember that Supabase uses `image_url` (snake_case) instead of `imageUrl` (camelCase).

## Firebase Cleanup
The old Firebase files are still in your project but not imported:
- `src/lib/firebase.js` - Deprecated, can be deleted
- `app/login/firebase.d.ts` - Deprecated, can be deleted

You can safely delete these files or keep them as backup.

## Database Schema Reference

### Users Table
```sql
id (UUID) - Primary key, linked to auth.users
email (VARCHAR) - User email
role (VARCHAR) - 'user' or 'admin'
created_at (TIMESTAMP) - Account creation date
```

### Products Table
```sql
id (UUID) - Primary key
name (VARCHAR) - Product name
description (TEXT) - Product description
price (DECIMAL) - Product price
category (VARCHAR) - Product category
image_url (VARCHAR) - Product image URL
created_at (TIMESTAMP) - Product creation date
updated_at (TIMESTAMP) - Last update date
```

### Orders Table
```sql
id (UUID) - Primary key
user_id (UUID) - Foreign key to users
user_email (VARCHAR) - Customer email
items (JSONB) - Array of order items {id, name, quantity, price}
total (DECIMAL) - Order total
phone (VARCHAR) - Customer phone
method (VARCHAR) - Payment method ('ecocash' or 'cod')
status (VARCHAR) - 'pending', 'shipped', or 'completed'
created_at (TIMESTAMP) - Order date
updated_at (TIMESTAMP) - Last update date
```

## Support

For more info on Supabase features:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)

Happy building! 🚀
