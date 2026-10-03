# Personal Book Tracker

This is a React Native book tracker app that lets users sign in and manage their personal reading list. Users sign in with email and password, see only their own books fetched from Firestore, and can add new books that are saved under their account. The app has three screens: Login, MyBooks, and AddBook — all connected through a Stack Navigator.

The app starts without errors but three Firebase integration points are not working correctly. Sign-in appears to do nothing, the MyBooks screen always shows an empty list even though Firestore has books for the test user, and books added through the AddBook screen are not associated with the signed-in user.

## Test Credentials

A test user has been pre-created in the Auth emulator and their books have been seeded into Firestore:
- **Email:** `reader@demo.com`
- **Password:** `password123`

## Objectives

- Fix the sign-in flow so it correctly authenticates the user and handles wrong-password or user-not-found errors with a visible error message on screen.
- Implement an auth state listener so the app automatically shows the Login screen when unauthenticated and navigates to MyBooks when the user is signed in — persisting across app restarts.
- Fix the MyBooks screen so it fetches and displays only the signed-in user's books from Firestore, sorted by rating from highest to lowest.
- Fix the AddBook screen so new books are saved to Firestore with the correct owner linked to the signed-in user, with basic validation ensuring title and author are not empty.

## Helpful Tips

- Consider how Firebase Authentication provides access to the currently signed-in user and where that information should live in your app.
- Think about what needs to happen at the app level when auth state changes — not just when the user presses the sign-in button.
- Explore the Firestore query capabilities for filtering documents by a specific field value and ordering results.
- Review what fields should be written to Firestore when a new book is created so it can later be retrieved for the correct user.
