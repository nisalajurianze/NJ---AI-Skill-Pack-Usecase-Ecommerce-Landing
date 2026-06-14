# Veloce Tech — Project Details & Architecture

A complete breakdown of the premium e-commerce landing page project: directory structure, coding design, styling system, and the impact of the custom skill pack.

---

## 1. Project Directory Structure
All project assets and source code are located in the project directory:
- **Root Directory**: `D:\Projects\NJ - AI Skill Pack Usecase-Ecommerce-Landing\`
  - [index.html](file:///D:/Projects/NJ%20-%20AI%20Skill%20Pack%20Usecase-Ecommerce-Landing/index.html) — Contains structured HTML5 elements, navigation menus, product cards, FAQ section, cart drawer, and interactive badges.
  - [style.css](file:///D:/Projects/NJ%20-%20AI%20Skill%20Pack%20Usecase-Ecommerce-Landing/style.css) — Implements color themes, mesh gradients, cursor spotlight masks, conic-gradient borders, and custom media queries.
  - [app.js](file:///D:/Projects/NJ%20-%20AI%20Skill%20Pack%20Usecase-Ecommerce-Landing/app.js) — Houses state logic, cursor coordinate math, window handlers, drawer actions, accordion switches, and notification alerts.
  - **Assets**: `/assets/`
    - `headphones.png` — Featured product image (luminous neon purple headphones).
    - `smartwatch.png` — Smart watch image (glassmorphic cyber telemetry watch).
    - `earbuds.png` — Sleek earbud charging case (neon emerald earbuds).

---

## 2. Technical Styling Mechanics (`style.css`)
To achieve the high-end "motionsites.ai" appearance, we utilized key CSS3 properties:

### 3D Perspective Transforms
The cards rotate dynamically in 3D space when hovered:
- `perspective(1000px)`: Defines the camera distance to the elements.
- `transform-style: preserve-3d`: Allows children to retain their 3D placements.
- `translateZ(20px)`: Brings card contents forward, creating a layered floating appearance.

### Interactive Cursor Spotlight Grids
- A fixed grid container (`.grid-overlay`) overlays the background with thin white lines.
- `mask-image: radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), black 20%, transparent 100%)` creates a spotlight mask.
- As the cursor moves, JavaScript updates the CSS custom properties `--mouse-x` and `--mouse-y` to move the mask, lighting up grid lines only under the cursor.

### Conic-Gradient Border Sweep
- Uses `@property --angle` to define a custom CSS variable that can be animated with `@keyframes`.
- `conic-gradient(from var(--angle), transparent 60%, var(--accent-purple) 85%, var(--accent-blue) 100%)` creates a colored sweep border that rotates continuously.

---

## 3. Dynamic Javascript State (`app.js`)
Interactivity is handled by modular vanilla JS functions:

### Cart State Array
Stores cart items as objects:
```javascript
let cart = [
  { id: 'headphones', name: 'Veloce X1 Pro', price: 299.00, quantity: 1, image: 'assets/headphones.png' }
];
```
- **Updates**: Functions handle adding new products, incrementing or decrementing counts, removing objects, and updating badge text labels.
- **Formulas**: Subtotals are recalculated iteratively using:
  \[\text{Subtotal} = \sum (\text{item.price} \times \text{item.quantity})\]

### Toast Notification System
- A template toast node is generated programmatically on actions:
  - Added items.
  - Form validation.
  - Checkout complete (clears cart, issues success toast, closes drawer).
- Uses simple `setTimeout` tasks to trigger fadeout states and detach cards from DOM cleanly.

---

## 4. Skill Pack Influence
The system loaded rules from several workspace configuration directories:
1. **`nisal-global-orchestrator`**: Handled setup routing, calling task plans, design guides, and browser tests in order.
2. **`nj-auto-planner`**: Enforced task tracking using `task.md` and `implementation_plan.md` to prevent context drift.
3. **`nj-landing-page-design-guardian`**: Standardized high-contrast hero layouts, text gradient sweeps, and soft drop shadows.
4. **`nj-motionsites-design-guardian`**: Supplied baseline styling templates for dark HSL variables and mouse-coordinate calculations.
5. **`agent-browser-verify`**: Directed browser checks using Puppeteer command flags to verify click behaviors and screenshot layouts.
6. **`caveman`**: Optimized response formats to keep logs short and token-efficient.
