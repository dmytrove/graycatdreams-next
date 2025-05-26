# Project Glossary

---

**Admin**
: A privileged user with access to special controls, such as creating custom-named sessions, managing all animations, and setting custom names. Admins authenticate using a secret and can perform actions unavailable to regular users.

**Author**
: The creator or owner of a specific animation session. An author is either the user whose session ID matches the animation or an admin. Authors can upload, delete, and manage images and animation options for their session.

**User**
: Any person interacting with the application. Users can view and interact with public animations. If they create or upload images, they become the author of that session.

**Viewer**
: A user who is viewing an animation but does not have author or admin privileges for that session. Viewers can see and interact with the animation but cannot modify or delete content.

**Session**
: A unique context identified by a session ID, representing a user's or admin's animation workspace. Sessions store uploaded images, animation options, and (optionally) a custom name. Session IDs are managed via cookies.

**Animation**
: A 3D scene composed of user-uploaded images, rendered with various movement, lighting, and interaction options. Animations are customizable and can be shared or downloaded as videos.

**Instance**
: A single occurrence of an image rendered in the 3D animation. Multiple instances of the same image can appear, each with unique position, scale, and movement, managed efficiently using instanced rendering for performance.

---
