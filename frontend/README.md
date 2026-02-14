# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🎨 Timetable UI Design - Color Palette & Layout

## Bảng màu chính

```css
--primary: #4682A9        /* Xanh dương chính - Buttons, Headers */
--primary-light: #91C8E4  /* Xanh nhạt - Accents, Highlights */
--secondary: #749BC2      /* Xanh phụ - Gradients */
--bg-main: #F1F5F9        /* Nền trang - Xám nhạt */
--bg-card: #F6F4EB        /* Nền card - Kem nhạt */
--white: #ffffff          /* Trắng - Card backgrounds */
```

## 🎯 Áp dụng màu sắc

### 1. **Controls Section (Dropdown & Buttons)**
```
Background: White (#ffffff)
Border: Light gray (#e2e8f0)
Shadow: Soft blue shadow (rgba(70, 130, 169, 0.1))
Border-radius: 16px (bo góc mềm mại)

Dropdowns:
- Background: #F6F4EB (kem nhạt)
- Border: #e2e8f0
- Hover: White background + #91C8E4 border
- Focus: #4682A9 border + soft shadow

Button:
- Background: Gradient (#4682A9 → #749BC2)
- Hover: Reverse gradient + lift effect
- Shadow: Blue shadow
```

### 2. **Table Headers**
```
Background: Gradient (#4682A9 → #749BC2)
Text: White (#ffffff)
Font-weight: 700 (bold)
Text-shadow: Subtle shadow
Border-radius: 12px (top corners)
```

### 3. **Period Cells**
```
Background: Gradient (#91C8E4 → #749BC2)
Text: White
Font-weight: 700
```

### 4. **Table Body**
```
Odd rows: White (#ffffff)
Even rows: Cream (#F6F4EB)
Hover: Light blue overlay (rgba(145, 200, 228, 0.15))
```

### 5. **Active Cells**
```
Background: Gradient (rgba(145, 200, 228, 0.2) → rgba(116, 155, 194, 0.15))
Border-left: 4px solid #4682A9
Top border: Gradient accent line
Shadow: Inset soft shadow
Hover: Stronger gradient + scale effect
```

### 6. **Footer Buttons**
```
Default:
- Background: Gradient (white → cream)
- Border: #e2e8f0
- Text: Dark gray

Hover:
- Background: Gradient (#4682A9 → #749BC2)
- Text: White
- Lift effect + shadow

Disabled:
- Background: Gray (#e2e8f0)
- Text: Light gray (#a0aec0)
```

### 7. **Loading Spinner**
```
Background overlay: Gradient blue with blur
Spinner border: #91C8E4 (light)
Spinner top: #4682A9 (primary)
Spinner bottom: #749BC2 (secondary)
Shadow: Blue glow
```

## 📐 Layout Modern

### **Card-based Design**
Tất cả sections đều là cards với:
- `border-radius: 16px` (góc bo tròn)
- `box-shadow: 0 4px 20px rgba(70, 130, 169, 0.1)` (bóng mềm)
- `margin: 2rem` (khoảng cách đều)
- `border: 1px solid #e2e8f0` (viền nhẹ)

### **Spacing**
```
Container padding: 2rem - 2.5rem
Gap between elements: 1.5rem - 2rem
Margin between cards: 2rem
```

### **Typography**
```
Headers: font-weight: 700, letter-spacing: 0.8px
Buttons: font-weight: 600, letter-spacing: 0.3px
Labels: font-weight: 600
Body text: font-weight: 500
```

### **Transitions & Animations**
```
All elements: transition: 0.2s - 0.3s ease
Hover effects: transform: translateY(-2px to -3px)
Active cells: transform: scale(1.02)
Loading spinner: smooth rotation
```

## 🎨 Visual Hierarchy

### **Level 1: Primary Actions**
- "In TKB" button
- Table headers
- Footer navigation buttons (on hover)

**Color:** Primary gradient (#4682A9 → #749BC2)

### **Level 2: Content Containers**
- Controls card
- Table wrapper
- Info text
- Footer buttons card

**Color:** White with soft shadows

### **Level 3: Form Elements**
- Dropdowns
- Input fields

**Color:** Cream background (#F6F4EB)

### **Level 4: Table Content**
- Table rows
- Schedule cells

**Color:** Alternating white and cream

### **Level 5: Accents**
- Active cell borders
- Hover effects
- Focus states

**Color:** Light blue (#91C8E4)

## 🌟 Key Features

### **1. Gradient Usage**
- Buttons: Diagonal gradient (135deg)
- Headers: Diagonal gradient (135deg)
- Hover states: Reverse gradient direction
- Active cells: Subtle transparent gradient

### **2. Shadows**
```
Cards: 0 4px 20px rgba(70, 130, 169, 0.1)
Buttons: 0 4px 12px rgba(70, 130, 169, 0.25)
Hover: 0 6px 16px rgba(70, 130, 169, 0.35)
```

### **3. Border Radius**
```
Cards: 16px
Buttons: 10px
Inputs: 10px
Table: 12px
Small elements: 6px
```

### **4. Interactive States**
```
Hover: Lift up + stronger shadow + color change
Focus: Border color change + glow effect
Active: Slight press down effect
Disabled: Desaturated colors + no interaction
```

## 📱 Responsive Breakpoints

### **Desktop (> 1200px)**
- Full margins: 2rem
- All features visible

### **Tablet (768px - 1200px)**
- Reduced margins: 1rem
- Horizontal scroll for table

### **Mobile (< 768px)**
- Minimal margins: 0.75rem
- Stacked layout
- Full-width buttons
- 2-column footer buttons

