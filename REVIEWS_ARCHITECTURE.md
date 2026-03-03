# Reviews System - Architecture & Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Product Detail Page                          │
│                    (e.g., /products/[id])                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ ProductReviews  │ (Main Container)
                    │  Component      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼──────┐  ┌─────────▼───────┐
│  Rating Card   │  │ ReviewForm    │  │  ReviewList     │
│  (Display)     │  │  (Input)      │  │  (Display)      │
└───────┬────────┘  └────────┬──────┘  └─────────┬───────┘
        │                    │                    │
        │            ┌───────▼──────┐      ┌──────▼────────┐
        │            │ StarRating   │      │  ReviewCard[] │
        │            │ (Interactive)│      │  Components   │
        │            └──────────────┘      └───────┬───────┘
        │                                          │
        │                                   ┌──────▼────────┐
        │                                   │  StarRating   │
        │                                   │  (Display)    │
        │                                   └───────────────┘
        │
        └──────────────────────┬──────────────────────┐
                               │                      │
                        ┌──────▼────────┐    ┌────────▼──────┐
                        │ Firestore DB  │    │  User Actions │
                        │  (Reviews     │    │  (Vote, Sort) │
                        │   Table)      │    └────────────────┘
                        └───────────────┘
```

## Component Hierarchy

```
ProductReviews (Main)
├── Rating Summary Section
│   ├── Average Rating Card
│   │   └── StarRating (display)
│   └── Rating Distribution Chart
│
├── Form Section (Sticky)
│   └── ReviewForm
│       ├── StarRating (interactive)
│       ├── Text Inputs
│       └── Submit Button
│
└── Reviews Section
    └── ReviewList
        ├── Sort Controls
        └── ReviewCard[] (mapped)
            ├── StarRating (display)
            ├── User Info
            ├── Review Content
            └── Helpful Button
```

## Data Flow

### Submitting a Review
```
User Input
    ↓
ReviewForm Validation
    ↓
onSubmit Callback
    ↓
Save to Firestore
    ↓
Update Local State
    ↓
New Review Appears in List
```

### Voting Helpful
```
User Clicks Helpful
    ↓
onHelpful Callback
    ↓
Update Firestore (helpful count++)
    ↓
Update Local State
    ↓
Button Visual Feedback
```

### Sorting/Filtering
```
User Selects Sort Option
    ↓
ReviewList gets sorted
    ↓
RecalculateSorted Array
    ↓
Re-render ReviewCard[]
```

## File Structure

```
components/
├── StarRating.tsx              # ⭐ Star display/input component
├── ReviewCard.tsx              # Review card display
├── ReviewForm.tsx              # Review submission form
├── ReviewList.tsx              # Reviews list with sorting
├── ProductReviews.tsx          # Main container component
└── ProductCard.tsx             # (Updated with rating display)

lib/
├── dateUtils.ts                # Date formatting utilities
├── firebase.js                 # (Existing Firebase config)
└── ...

dataconnect/
└── schema/
    └── schema.gql              # (Updated with Review table)

app/
├── admin/products/
│   └── detail/
│       └── page.tsx            # Example product detail page
└── ...

REVIEWS_SYSTEM_DOCS.md          # Full documentation
REVIEWS_ARCHITECTURE.md         # This file
```

## UI Layout - Desktop View

```
┌────────────────────────────────────────────────────────────────────┐
│ Product Detail Page                                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────┐              ┌─────────────────────────────┐   │
│  │   Product    │              │   Product Details           │   │
│  │   Image      │              │   • Material: Silver        │   │
│  │   ✨         │              │   • Gemstone: Amethyst      │   │
│  │              │              │   • Category: Rings         │   │
│  └──────────────┘              └─────────────────────────────┘   │
│                                                                    │
│  ┌──────────────┐              ┌─────────────────────────────┐   │
│  │   $259.99    │              │   [Add to Cart Button]      │   │
│  └──────────────┘              └─────────────────────────────┘   │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ Customer Reviews                                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────┐                                              │
│  │ Rating: 4.5 ⭐  │        ┌─────────────────────────────────┐  │
│  │ 24 Reviews      │        │ Customer Ratings              │  │
│  │                 │        │ 5⭐  ████████████ 12 reviews   │  │
│  │ Rating          │        │ 4⭐  ████████ 8 reviews        │  │
│  │ Breakdown:      │        │ 3⭐ ████ 3 reviews            │  │
│  │                 │        │ 2⭐ ██ 1 reviews              │  │
│  │ 5⭐: 12         │        │ 1⭐  0 reviews                │  │
│  │ 4⭐: 8          │        └─────────────────────────────────┘  │
│  │ 3⭐: 3          │                                              │
│  │ 2⭐: 1          │                                              │
│  │ 1⭐: 0          │                                              │
│  └─────────────────┘                                              │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────┐  ┌──────────────────────────┐     │
│  │   Share Your Experience  │  │   Customer Reviews       │     │
│  │                          │  │   [Sort: Recent ▼]       │     │
│  │ Rating: ⭐⭐⭐⭐⭐          │  │                          │     │
│  │                          │  │ ┌────────────────────┐   │     │
│  │ Review Title             │  │ │ Sarah M. ⭐⭐⭐⭐⭐    │   │     │
│  │ [_________________]      │  │ │ "Absolutely stunni" │   │     │
│  │                          │  │ │ "The quality of ... │   │     │
│  │ Your Review              │  │ │ 👍 Helpful (12)    │   │     │
│  │ [________________        │  │ └────────────────────┘   │     │
│  │  ________________        │  │                          │     │
│  │  ________________]       │  │ ┌────────────────────┐   │     │
│  │                          │  │ │ Jessica L. ⭐⭐⭐⭐  │   │     │
│  │ [Submit Review Button]   │  │ │ "Beautiful piece..." │   │     │
│  │                          │  │ │ 👍 Helpful (8)     │   │     │
│  └──────────────────────────┘  │ └────────────────────┘   │     │
│  (Sticky on scroll)            │                          │     │
│                                └──────────────────────────┘     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## UI Layout - Mobile View

```
┌────────────────────────────┐
│ Product Detail Page        │
├────────────────────────────┤
│  ┌──────────────────────┐  │
│  │   Product Image ✨   │  │
│  │                      │  │
│  └──────────────────────┘  │
│                            │
│  Product Name              │
│  ⭐⭐⭐⭐⭐ 4.5 (24)       │
│                            │
│  Product Details           │
│  • Material: Silver        │
│  • Gemstone: Amethyst      │
│                            │
│  $259.99                   │
│  [Add to Cart]             │
├────────────────────────────┤
│ Customer Reviews           │
├────────────────────────────┤
│                            │
│ Rating: 4.5 ⭐             │
│ 24 Reviews                 │
│                            │
│ Rating Breakdown:          │
│ 5⭐ ████████ 12           │
│ 4⭐ ████ 8                │
│ 3⭐ ██ 3                  │
│ 2⭐ █ 1                   │
│ 1⭐  0                    │
│                            │
├────────────────────────────┤
│ Share Your Experience      │
│                            │
│ Rating: ⭐⭐⭐⭐⭐           │
│ Title: [________]          │
│                            │
│ Review:                    │
│ [_________________        │
│  _________________        │
│  _________________]       │
│                            │
│ [Submit Review]            │
│                            │
├────────────────────────────┤
│ Customer Reviews           │
│ [Sort Options]             │
│                            │
│ ┌──────────────────────┐   │
│ │Sarah M. ⭐⭐⭐⭐⭐  │   │
│ │"Absolutely stunning!"│   │
│ │"The quality of this" │   │
│ │👍 Helpful (12)      │   │
│ └──────────────────────┘   │
│                            │
│ ┌──────────────────────┐   │
│ │Jessica L. ⭐⭐⭐⭐   │   │
│ │"Beautiful piece..."  │   │
│ │"Very happy with..."  │   │
│ │👍 Helpful (8)       │   │
│ └──────────────────────┘   │
│                            │
└────────────────────────────┘
```

## Color Palette

```
Primary Purple      #a78bfa  (Used for stars, buttons, accents)
Light Purple BG     #e8dff5  (Form backgrounds)
Border Gray         #e5e7eb  (Card borders)
Text Dark           #1f2937  (Headings)
Text Gray           #6b7280  (Body text)
Text Light          #9ca3af  (Secondary text)
Success Green       #22c55e  (Success states)
Error Red           #ef4444  (Error states)
```

## Component Props Flow

```
ProductReviews (Props)
├── productId: string
├── reviews: Review[]
├── averageRating: number
├── totalReviews: number
├── isLoading: boolean
├── onSubmitReview: (review) => Promise<void>
└── onHelpful: (reviewId) => void
    │
    ├─→ StarRating
    │   └── Props: rating, totalReviews, size
    │
    ├─→ ReviewForm
    │   ├── Props: productId, onSubmit, isLoading
    │   └─→ StarRating (interactive)
    │
    └─→ ReviewList
        ├── Props: reviews, isLoading, onHelpful
        └─→ ReviewCard[]
            ├── Props: id, userName, rating, title, text, createdAt, helpful, onHelpful
            └─→ StarRating (display)
```

## Integration Points

### 1. Product Card (Quick Rating View)
```tsx
<ProductCard
  product={{
    ...product,
    rating: 4.5,        // Add these fields
    reviewCount: 24
  }}
/>
```

### 2. Product Detail Page (Full Review System)
```tsx
<ProductReviews
  productId={productId}
  reviews={reviews}           // From Firestore
  averageRating={avgRating}   // Calculated
  totalReviews={reviews.length}
  onSubmitReview={handleSubmit}
  onHelpful={handleHelpful}
/>
```

## State Management

### Local State (Component Level)
- Review form inputs (rating, title, text)
- Sort preference
- Helpful votes (temporary UI state)
- Loading states
- Error messages

### Global Data (Firestore)
- Review documents
- Helpful count per review
- User review history (optional)

## Performance Considerations

1. **Lazy Loading**: Reviews paginated (load more on scroll)
2. **Memoization**: ReviewList memoizes sorted array
3. **Caching**: Cache average rating with product
4. **Pagination**: Load 10 reviews at a time
5. **Indexing**: Firestore indexes on (productId, createdAt)

## Security Rules (Firestore)

```
match /reviews/{document=**} {
  allow read: if true;  // Anyone can read
  allow create: if request.auth != null;  // Only authenticated users
  allow update: if request.auth.uid == resource.data.userId;  // Own reviews
  allow delete: if request.auth.uid == resource.data.userId && 
                   request.resource.data.createdAt < now - duration.value(86400, 's');  // 24 hours
}
```

---

This architecture provides a scalable, maintainable system for product reviews with professional UI/UX. ✨
