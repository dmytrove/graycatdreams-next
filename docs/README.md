# GrayCatDreams Webapp - Interactive 3D Image Animation

This web application allows users to upload images (PNG, WebP with transparency supported), see them floating in a live Three.js animation, and share or edit their animations. Authentication is cookie-based and anonymous, aiming for a user experience similar to services like telegra.ph.

The core feature is the **Interactive 3D Image Animation Tool**.

## Task Workflow

This project uses a `todo.md` file to track development tasks and priorities.

- Before starting work, open `todo.md` and pick a task.
- Mark the task as "in progress" and update its status as you work.
- When finished, mark the task as complete in `todo.md`.
- Always keep `todo.md` up to date for team visibility.

## Features

*   **Image Upload:** Supports uploading multiple images (PNG, JPG, WebP, with transparency).
*   **Dynamic 3D Animation:** Displays uploaded images as floating, interactive objects in a 3D space.
*   **Configurable Animation Parameters:**
    *   Spinning speed of images.
    *   Minimum and maximum size of images.
    *   Orbit distance of images around a central point.
    *   Attraction force towards the center.
    *   Orbiting speed.
    *   Bounciness off virtual boundaries.
*   **Image Count Control:** Specify how many instances of each unique uploaded image should appear in the animation.
*   **Image Management:** Users can delete their uploaded images.
*   **Persistent Options:** Animation parameters are saved and associated with a unique animation ID.
*   **Shareable Animation Links:** Animations can be shared via their unique URL.
*   **(Planned) User Dashboard:** To view and manage created animations.
*   **(Planned) Automatic Background Removal:** For uploaded images.

## Getting Started

1.  Install dependencies: `npm install` (or `yarn install`, `pnpm install`, `bun install`)
2.  Run the development server: `npm run dev` (or corresponding command for your package manager)
3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure Highlights

*   `src/app/`: Main application directory using Next.js App Router.
    *   `src/app/[id]/AnimationClient.tsx`: Client component for managing animation state, UI controls, and image uploads for a specific animation.
    *   `src/app/animation/[id]/Images3D.tsx`: Component responsible for the Three.js/React Three Fiber 3D scene rendering.
    *   `src/app/api/`: Backend API routes.
        *   `upload/`: Handles image uploads.
        *   `delete-image/`: Handles image deletion.
        *   `animation-options/`: Manages saving and loading of animation parameters.
*   `src/lib/`: Utility functions and libraries, e.g., `session-metadata-r2.ts` potentially for Cloudflare R2 integration.
*   `public/`: Static assets. (Note: Uploaded images are currently handled via API and may be stored externally, e.g., Cloudflare R2, rather than directly in `/public/uploads` for scalability).

## License

MIT 