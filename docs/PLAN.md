# Development Plan

## Phase 1: MVP (Largely Complete)
- [x] Set up Next.js app with git
- [x] Implement cookie-based anonymous authentication (session for animation authorship)
- [x] Image upload (PNG, WebP, JPG; transparency supported)
- [x] Store uploaded images (Cloudflare R2 / cloud storage)
- [x] Display uploaded images in a Three.js animation (floating effect with configurable parameters: spin, size, orbit, attraction, bounciness, image count)
- [x] Generate shareable links for animations
- [x] Allow editing of individual animations via their link

## Phase 2: Core Enhancements
- [ ] User dashboard: view and manage all created animations
- [ ] Integrate automatic background removal for uploads
- [ ] Support more image formats (if requested beyond PNG/JPG/WebP)
- [ ] Further animation customization options (e.g., new effects, more granular controls)
- [ ] Improve mobile experience and overall UI/UX responsiveness
- [x] Implement persistent storage for animation metadata (e.g., animation options via Cloudflare R2)

## Phase 3: Polish & Launch
- [ ] Comprehensive UI/UX review and polish
- [ ] Security review (file uploads, API endpoints)
- [ ] Optimize for performance (rendering, loading)
- [ ] Robust error handling and logging
- [ ] Final deployment setup and testing on Vercel (or chosen platform)

## Future Ideas (Post-Launch)
- User accounts (optional, for managing animations under one identity)
- Community features (e.g., browsing public animations) 