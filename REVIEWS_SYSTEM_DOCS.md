# Product Reviews & Ratings System

## Overview

A complete product review and rating system for the GLEAMIA e-commerce platform. Includes star ratings, review submissions, helpful voting, and rating analytics.

## Components

### 1. **StarRating.tsx** ⭐
Interactive star rating component for both display and input.

**Props:**
```typescript
interface StarRatingProps {
  rating: number;              // Current rating (0-5)
  totalReviews?: number;       // Number of reviews
  onRatingChange?: (rating: number) => void;  // Callback for interactive mode
  isInteractive?: boolean;     // Enable click-to-rate
  size?: 'sm' | 'md' | 'lg';  // Visual size
}
```

**Usage:**
```tsx
// Display mode (read-only)
<StarRating rating={4.5} totalReviews={24} size="md" />

// Interactive mode (for forms)
<StarRating 
  rating={rating} 
  onRatingChange={setRating} 
  isInteractive={true}
  size="lg"
/>
```

---

### 2. **ReviewCard.tsx**
Individual review display card with user info, rating, and helpful button.

**Props:**
```typescript
interface ReviewCardProps {
  id: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  createdAt: Date | string;
  helpful: number;
  onHelpful?: (reviewId: string) => void;
}
```

**Features:**
- User name and post date
- Star rating display
- Review title and text (with line clamping)
- Helpful voting button
- Hover effects and transitions

---

### 3. **ReviewForm.tsx**
Form for submitting new reviews.

**Props:**
```typescript
interface ReviewFormProps {
  productId: string;
  onSubmit?: (review: {
    rating: number;
    title: string;
    text: string;
  }) => Promise<void>;
  isLoading?: boolean;
}
```

**Features:**
- Interactive star rating selector
- Title input (max 100 chars)
- Review text area (max 1000 chars, min 10 chars)
- Real-time character counters
- Error and success messages
- Form validation
- Loading state

---

### 4. **ReviewList.tsx**
Display multiple reviews with sorting options.

**Props:**
```typescript
interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  onHelpful?: (reviewId: string) => void;
}
```

**Features:**
- Sort by: Recent, Helpful, Rating
- Loading skeleton animation
- Empty state message
- Maps ReviewCard components

---

### 5. **ProductReviews.tsx** (Main Component)
Complete reviews section combining form, list, and analytics.

**Props:**
```typescript
interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  isLoading?: boolean;
  onSubmitReview?: (review: {...}) => Promise<void>;
  onHelpful?: (reviewId: string) => void;
}
```

**Features:**
- Average rating display card
- Rating distribution breakdown (bar chart)
- Review submission form (sticky on desktop)
- Complete review list
- Responsive grid layout

---

## Database Schema

### Review Table
```graphql
type Review @table {
  product: Product!
  user: User!
  rating: Int!           # 1-5 stars
  title: String!         # Review headline
  text: String!          # Full review text
  createdAt: Timestamp!
  helpful: Int           # Helpful count
}
```

---

## Integration Guide

### Step 1: Add StarRating to ProductCard
```tsx
import StarRating from './StarRating';

// In ProductCard component
{product.rating !== undefined && (
  <div className="mb-3">
    <StarRating 
      rating={product.rating} 
      totalReviews={product.reviewCount}
      size="sm"
    />
  </div>
)}
```

### Step 2: Use ProductReviews on Product Detail Page
```tsx
'use client';

import ProductReviews from '@/components/ProductReviews';
import { useEffect, useState } from 'react';

export default function ProductDetailPage({ params }) {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product and reviews from Firestore
  useEffect(() => {
    // Fetch logic here
  }, [params.id]);

  const handleSubmitReview = async (reviewData) => {
    setIsLoading(true);
    try {
      // Save to Firestore
      const newReview = {
        id: Date.now().toString(),
        ...reviewData,
        createdAt: new Date(),
        helpful: 0,
        userName: currentUser.displayName,
      };
      setReviews(prev => [newReview, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    // Update helpful count in Firestore
    setReviews(prev =>
      prev.map(r => 
        r.id === reviewId 
          ? { ...r, helpful: r.helpful + 1 }
          : r
      )
    );
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      {/* Product details */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={reviews.length}
        isLoading={isLoading}
        onSubmitReview={handleSubmitReview}
        onHelpful={handleHelpful}
      />
    </div>
  );
}
```

---

## Firestore Integration (Backend)

### Create Review
```typescript
// Add review to Firestore
const reviewRef = collection(db, 'reviews');
await addDoc(reviewRef, {
  productId: productId,
  userId: currentUser.uid,
  rating: formData.rating,
  title: formData.title,
  text: formData.text,
  createdAt: serverTimestamp(),
  helpful: 0
});
```

### Fetch Reviews
```typescript
// Get all reviews for a product
const reviewsQuery = query(
  collection(db, 'reviews'),
  where('productId', '==', productId),
  orderBy('createdAt', 'desc')
);

const snapshot = await getDocs(reviewsQuery);
const reviews = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Calculate Average Rating
```typescript
// Fetch product with average rating
const productRef = doc(db, 'products', productId);
const productSnap = await getDoc(productRef);

// Calculate average from reviews
const reviewsQuery = query(
  collection(db, 'reviews'),
  where('productId', '==', productId)
);
const reviewsSnap = await getDocs(reviewsQuery);
const reviews = reviewsSnap.docs.map(d => d.data());

const averageRating = reviews.length > 0
  ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  : 0;

// Update product with average rating (optional for performance)
await updateDoc(productRef, {
  averageRating,
  reviewCount: reviews.length
});
```

---

## Styling Features

### Color Scheme
- **Primary**: Purple (#a78bfa, #9333ea)
- **Accent**: Light purple backgrounds
- **Text**: Gray scale (gray-700 to gray-900)
- **Borders**: Light gray (#e5e7eb)

### Animations
- Smooth transitions on interactions
- Hover scale effects on stars
- Loading skeleton animation
- Success/error message animations

### Responsive Design
- Mobile: Stacked layout
- Desktop: 3-column layout (form sticky on left/right)
- Tablet: Adjusted spacing

---

## Example Component Structure

```
ProductDetailPage
├── Product Image & Info
├── Product Description
└── ProductReviews (Main Reviews Component)
    ├── Rating Summary Card
    │   ├── Average Rating Display
    │   └── Total Review Count
    ├── Rating Breakdown
    │   └── Distribution Bar Chart
    ├── ReviewForm (Sticky on Desktop)
    │   ├── StarRating (Interactive)
    │   ├── Title Input
    │   ├── Text Area
    │   └── Submit Button
    └── ReviewList
        ├── Sort Controls
        └── ReviewCard[] (Mapped)
            ├── StarRating (Display)
            ├── Review Content
            └── Helpful Button
```

---

## Features Implemented

✅ **Star Ratings** - 5-star interactive and display modes
✅ **Review Submission** - Form with validation
✅ **Review Display** - Cards with user info and content
✅ **Rating Analytics** - Average rating and distribution
✅ **Helpful Voting** - Like/upvote reviews
✅ **Sorting** - Sort by recent, helpful, or rating
✅ **Mobile Responsive** - Works on all screen sizes
✅ **Loading States** - Skeleton loaders during fetch
✅ **Empty States** - Friendly messages when no reviews
✅ **Professional UI** - Light purple theme, smooth animations

---

## Future Enhancements

- Verified purchase badge for reviews
- Review images/photos
- Review replies/moderation
- Filter by rating range
- More sorting options (oldest, most recent)
- Review analytics dashboard for sellers
- Spam detection and moderation tools
