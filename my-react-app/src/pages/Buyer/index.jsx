import React from 'react'

const Index = () => {
  return (
    <div>index</div>
  )
}

export default Index;

// Field	Example
// Name	Santhosh
// Phone Number	98765 43210
// Email	santhosh@gmail.com
// City	Coimbatore
// Interested In	Pulsar 150, under ₹50k

// 💬 Optional Buyer Features
// Save bikes to wishlist

// Message seller

// Schedule test ride

// Buyer can rate seller (like OLX)

// 🔐 If No Registration:
// Buyer just sees listings

// Clicks “Call Seller” or “Message on WhatsApp” button

// No need to store buyer details

// 📦 Where to Store Buyer Info?
// If you use login for buyers:

// Store in /users or /buyers folder

// MongoDB table: Buyers or Users

// ✅ Summary
// Purpose	Needs Buyer Details?
// View bikes only	❌ No
// Chat / Save bikes	✅ Yes
// Analytics / Leads	✅ Optional;