---
name: Forget Password Functionality
about: Add a secure "Forget Password" feature to help users reset their password easily.
title: feature request
labels: enhancement, help wanted
assignees: ''

---

### [Feature Request] Forget Password Functionality

---

### Is your feature request related to a problem? Please describe.

Yes, currently there's no way for users to reset their password if they forget it. This can lock users out of their accounts, especially if they don’t have admin support.

---

### Describe the solution you'd like

Implement a “Forget Password” feature where:
- User enters their email on a "Forgot Password" page
- A secure, time-limited reset link is sent to their email
- User clicks the link and is redirected to a form to set a new password
- Backend verifies the reset token and updates the user's password

---

### Describe alternatives you've considered

- Manual password resets by admin (not scalable)
- Asking users to re-register (not user-friendly)

---

### Additional context

**Suggested Tech Stack**:
- `Nodemailer` (or any transactional email API) to send the reset email
- `JWT` or `crypto.randomBytes` for secure tokens
- MongoDB schema update to store reset token + expiry timestamp
- Add appropriate error handling and input validation

---

### Optional additional items

**Assignees**:  
@rajashekarpatha07
