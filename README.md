# GrayCAT Dreams - 3D Image Animation Platform

A Next.js application that creates beautiful 3D animations with user-uploaded images using WebGL and Three.js.

## 🚀 Recent Optimizations (v0.2.0)

### ✅ **Major Issues Fixed**

1. **Type System Consolidation**
   - ✅ Unified `AnimationOptions` interface across the entire codebase
   - ✅ Eliminated 4+ duplicate type definitions
   - ✅ Added comprehensive type validation in API routes
   - ✅ Created centralized type system in `/src/types/index.ts`

2. **ESLint Configuration Cleanup**
   - ✅ Removed duplicate ESLint configs (.eslintrc.js, .eslintrc.json)
   - ✅ Streamlined to single `eslint.config.mjs`
   - ✅ Improved code quality rules while maintaining productivity

3. **Code Duplication Elimination**
   - ✅ Extracted reusable UI components
   - ✅ Created custom hooks for complex logic
   - ✅ Consolidated utility functions
   - ✅ Replaced inline styles with CSS modules

4. **Performance Optimizations**
   - ✅ Implemented proper memoization with React.memo
   - ✅ Added debounced auto-save for settings
   - ✅ Optimized bundle splitting in Next.js config
   - ✅ Enhanced image processing with Sharp
   - ✅ Added proper caching headers

5. **UI/UX Improvements**
   - ✅ Created comprehensive CSS design system
   - ✅ Implemented responsive sidebar design
   - ✅ Added proper loading states and error handling
   - ✅ Enhanced accessibility with ARIA labels
   - ✅ Improved mobile experience

6. **Architecture Improvements**
   - ✅ Introduced proper API abstraction layer
   - ✅ Created custom hooks for state management
   - ✅ Separated concerns between UI and business logic
   - ✅ Added comprehensive error boundaries
   - ✅ Implemented proper TypeScript throughout

## 📁 **New File Structure**

```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components (Button, Sidebar, etc.)
│   └── animation/        # Animation-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   └── api/             # API client abstraction
├── styles/               # CSS modules and design system
└── types/                # Centralized TypeScript definitions
```

## 🛠 **Technical Improvements**

### **Custom Hooks Created**
- `useAnimationOptions` - Manages animation settings with auto-save
- `useFileUpload` - Handles file upload with validation
- `useResponsiveSidebar` - Manages responsive sidebar state
- `useVideoRecorder` - Handles canvas video recording

### **UI Components Library**
- `Button` - Consistent button component with variants
- `Sidebar` - Responsive sidebar with toggle functionality
- `ImageGrid` - Optimized grid for displaying uploaded images
- `FileUpload` - Drag-and-drop file upload component
- `AnimationOptionsForm` - Form for animation settings

### **CSS Design System**
- CSS custom properties for consistent theming
- Responsive breakpoints and utilities
- Accessibility-focused design patterns
- Dark mode support built-in

### **API Improvements**
- Proper error handling and validation
- Type-safe request/response interfaces
- Input sanitization and security
- Optimized image processing pipeline

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd graycatdreams-next

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Environment Variables Required

```env
# R2/S3 Configuration
R2_ENDPOINT=your-r2-endpoint
R2_BUCKET=your-bucket-name
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
```

## 📚 **API Documentation**

### **Animation Options API**
- `GET /api/animation-options?session_id={id}` - Get animation settings
- `POST /api/animation-options?session_id={id}` - Save animation settings

### **File Upload API**
- `POST /api/upload` - Upload image files (supports PNG, JPEG, WebP)

### **Image Management API**
- `GET /api/user-images` - Get user's uploaded images
- `DELETE /api/delete-image?url={url}` - Delete specific image

### **Session Management API**
- `POST /api/delete-animation?session_id={id}` - Delete animation and all images

## 🔧 **Development Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checking
npm run clean        # Clean build artifacts
```

## 🏗 **Architecture Overview**

### **Frontend Architecture**
- **Next.js 15** with App Router
- **React 19** with modern hooks and Suspense
- **Three.js** for 3D rendering via React Three Fiber
- **TypeScript** for type safety
- **CSS Modules** for styling

### **Backend Architecture**
- **Next.js API Routes** for serverless functions
- **AWS S3/R2** for image storage
- **Sharp** for image optimization
- **Session-based** user management

### **State Management**
- Custom hooks for complex state logic
- React built-in state management
- Auto-saving settings with debouncing
- Optimistic UI updates

## 🎨 **Features**

### **3D Animation System**
- Multiple movement templates (Orbit, Drift, Spiral, Bounce, Wave)
- Customizable animation parameters
- Real-time parameter adjustment
- Parallax camera effects

### **Image Management**
- Drag-and-drop upload
- Automatic WebP conversion
- Image optimization and resizing
- Batch upload support

### **User Experience**
- Responsive design for all devices
- Accessible interface with ARIA labels
- Keyboard navigation support
- Loading states and error handling

### **Export Features**
- Video recording of animations
- Shareable URLs for animations
- Download animations as WebM videos

## 🔐 **Security Features**

- Input validation and sanitization
- File type and size restrictions
- Session-based access control
- Security headers in Next.js config
- XSS and CSRF protection

## 📱 **Browser Support**

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

WebGL support required for 3D features.

## 🐛 **Known Issues & Future Improvements**

### **Planned Enhancements**
- [ ] Add animation templates gallery
- [ ] Implement user accounts and persistent storage
- [ ] Add more export formats (GIF, MP4)
- [ ] Social sharing integration
- [ ] Advanced lighting controls
- [ ] Batch image processing
- [ ] Animation keyframe editor

### **Performance Optimizations**
- [ ] Implement virtual scrolling for large image lists
- [ ] Add service worker for offline support
- [ ] Optimize Three.js bundle size further
- [ ] Add progressive loading for 3D scenes

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- Three.js community for 3D graphics
- React Three Fiber for React integration
- Next.js team for the framework
- Sharp for image processing
- AWS for cloud storage solutions

---

**Version 0.2.0** - Major optimization and refactoring update
**Previous Version 0.1.0** - Initial release
