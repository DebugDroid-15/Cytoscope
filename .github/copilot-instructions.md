# CYTOSCOPE Development Instructions

## Project Overview
CYTOSCOPE is a single-file React SPA for educational cytology visualization and AI-driven diagnosis demonstration.

## Technology Stack
- React 19.2 with Hooks
- Vite 7.3 build tool
- Tailwind CSS 4.1 for styling
- Framer Motion 12.34 for animations
- Recharts 3.7 for data visualization
- Lucide React 0.56 for icons
- HTML5 Canvas for custom 3D simulations

## Key Features Implemented
1. Animated particle canvas hero with mouse interactivity
2. Interactive scrollable timeline with detail modals
3. Virtual microscope simulator with focus/zoom/stain controls
4. AI diagnostic simulator with scanning laser effect
5. 3D morphometric data visualization with scatter and radar charts
6. Glassmorphic UI design with scientific aesthetics
7. Fully responsive mobile and desktop layouts
8. Comprehensive scientific educational content

## Code Organization
- Single-file architecture: `src/App.jsx`
- All components, hooks, and logic contained in one file for simplicity
- Custom CSS utilities in `src/index.css`
- Responsive Tailwind configuration in `tailwind.config.js`

## Development Workflow

### Running the Application
```bash
npm run dev
```
Application will be available at http://localhost:5173/

### Building for Production
```bash
npm run build
```
Creates optimized build in `dist/` directory.

### Previewing Production Build
```bash
npm run preview
```

## Module Breakdown

### 1. ParticleCanvasHero Component
- Renders animated particle system background
- Particles attracted to mouse movement
- Connecting lines between nearby particles
- Performance-optimized with requestAnimationFrame

### 2. Timeline & TimelineModal Components
- Four historical events with detailed information
- AnimatePresence for smooth modal transitions
- Framer Motion for entry animations

### 3. VirtualMicroscope Component
- Canvas-based cell visualization
- Focus slider (blur effect simulation)
- Zoom slider (canvas scaling with pan)
- Stain toggle (H&E vs. Papanicolaou colors)
- Educational notes on cellular features

### 4. AIDiagnosticSimulator Component
- Scanning laser line animation
- Automated detection with bounding boxes
- Confidence score display
- Random cell classification

### 5. MorphometricData Component
- Recharts ScatterChart for nuclear size vs. circularity
- RadarChart comparing benign/malignant profiles
- Toggle between datasets

### 6. Main App Component
- Orchestrates all sections
- Scroll event tracking
- Modal state management
- Responsive layout

## Scientific Content

### Educational Concepts Covered
- Cell theory and discovery history
- Diagnostic staining techniques (H&E, Pap)
- Cellular morphological features (Hyperchromasia, Pleomorphism)
- Nuclear-to-cytoplasmic (N/C) ratio
- AI in diagnostic pathology
- Morphometric analysis

### Historical Events
1. 1665: Hooke's Cork Discovery
2. 1839: Cell Theory Formulation
3. 1928: Papanicolaou Stain Development
4. 2023: AI-Enhanced Cytology

## Design System

### Color Palette
- Background: `#0f172a` (slate-900)
- Primary Accent: `#06b6d4` (cyan-500)
- Secondary Accent: `#14b8a6` (teal-500)
- Highlight: `#f97316` (orange-500)

### Typography
- Headers: `sans-serif` (system font)
- Data: `monospace` (system mono)
- Labels: `sci-header` class for uppercase tracking

### Component Classes
- `.glass-card`: Glassmorphism backdrop blur effect
- `.glow-effect`: Cyan shadow effect
- `.sci-button`: Gradient button with hover scale
- `.sci-input`: Themed input field

## Performance Optimizations
- Single file reduces HTTP requests
- Canvas rendering for particle effects
- Recharts ResponsiveContainer for automatic sizing
- Framer Motion GPU-accelerated animations
- Tailwind CSS purging for minimal output

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Considerations
- Semantic HTML structure
- High contrast colors (WCAG AA compliant)
- Button focus states
- Readable font sizes
- Alt text for canvas elements documented

## Future Enhancement Ideas
- WebGL for 3D rendering
- Real microscopy image library
- Interactive pathology quiz
- Molecular marker integration
- Virtual case studies
- Real-time video stream analysis

## Dependencies Documentation

### Core Dependencies
- **react**: UI framework
- **react-dom**: DOM rendering
- **vite**: Build tool and dev server

### Development Dependencies
- **@vitejs/plugin-react**: React Fast Refresh
- **tailwindcss**: Utility CSS framework
- **postcss**: CSS transformation
- **autoprefixer**: Browser prefix support
- **framer-motion**: Animation library
- **recharts**: React chart library
- **lucide-react**: Icon library

## Debugging Tips
1. Check browser console for errors (F12)
2. Verify particle canvas rendering in hero section
3. Test timeline modal animations
4. Verify chart data rendering with browser DevTools
5. Check responsive behavior at different viewport widths

## Common Issues & Solutions

### Particles not moving
- Check browser DevTools for requestAnimationFrame support
- Verify canvas ref is properly attached

### Data not displaying in charts
- Ensure recharts ResponsiveContainer has valid dimensions
- Check data array structure matches chart requirements

### Animations stuttering
- Verify GPU acceleration enabled in browser
- Reduce particle count if performance issues occur

### Styling issues
- Ensure Tailwind CSS build process completed
- Check postcss.config.js includes tailwindcss plugin

## Version Control

### Git Configuration
Add to `.gitignore`:
- `node_modules/`
- `dist/`
- `.env.local`
- `.DS_Store`

### Commit Guidelines
- Use descriptive commit messages
- Include component name in commits
- Reference issues when applicable

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Static Hosting
Build with `npm run build` then serve `dist/` folder

## Maintenance
- Keep dependencies updated monthly
- Monitor console for deprecation warnings
- Test responsive design on actual devices
- Validate scientific accuracy with domain experts
