---
name: Forget Password Functionality
about: Add a secure "Forget Password" feature to help users reset their password easily.
---

Add a "Forget Password" feature to improve user experience and accessibility.

Currently, users have no way to reset their password if they forget it. This feature will allow users to:
- Enter their email on a "Forgot Password" page
- Receive a secure, time-limited password reset link via email
- Set a new password using that link
- Have their password updated securely after backend token verification

**Tech Suggestions:**
- `Nodemailer` or any email service for sending reset links
- `JWT` or `crypto` to generate secure tokens
- Add token and expiry fields in the MongoDB user schema
- Input validation and error handling

This will reduce support needs and align the app with real-world standards.
