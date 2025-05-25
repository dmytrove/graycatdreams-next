# Technical Requirements & Specifications

## Functional Requirements
- Users can upload images (PNG, WebP, JPG; transparency supported)
- Uploaded images are displayed in a live Three.js animation (floating effect)
- Users can configure animation parameters (e.g., spin speed, image size, orbit distance, attraction force, orbit speed, bounciness)
- Users can control the number of instances for each uploaded image in the animation
- Users can share a unique link to their animation
- Users can view and edit their own animations (via the unique animation link)
- Authentication is anonymous and cookie-based (persistent session, no registration)

## Technical Specifications
- **Frontend Framework:** Next.js (React), TypeScript
- **3D Animation:** Three.js (via react-three-fiber)
- **Image Upload:** Handled via Next.js API route using FormData; supports PNG, WebP, JPG with transparency.
- **Image Storage:** Cloudflare R2 (or similar cloud object storage)
- **Authentication:** Cookie-based, anonymous session (no email/password)
- **Backend:** Next.js API routes (Node.js)
- **Animation Metadata Storage:** Cloudflare R2 (or similar, for storing animation options associated with an ID)
- **Image Processing:** Must preserve transparency in PNG/WebP. No background removal in current version.
- **Deployment:** Node.js-compatible environment (Vercel, etc.)

## Non-Functional Requirements
- Responsive UI (desktop/mobile)
- Fast image upload and rendering
- Secure file handling (validate file types, limit size)
- Shareable and persistent animation links

## Future Enhancements
- Automatic background removal (API or local model)
- User dashboard for listing and managing all created animations
- More advanced animation customization options
- User accounts (optional, for managing multiple animations under one identity)
- Further UI/UX improvements for mobile responsiveness. 