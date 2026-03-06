# Skincare Website Project Blueprint

## Project Overview
A modern, visually appealing, and responsive skincare website focused on providing a premium user experience. The design will emphasize clean aesthetics, vibrant colors, and interactive UI components to showcase skincare products and routines.

## Project Outline
- **Design Philosophy:** Minimalist, organic, and trustworthy. Use of soft gradients, deep shadows, and expressive typography.
- **Color Palette:** A range of oklch/lch hues inspired by natural skin tones and botanical elements (soft greens, warm peaches, clean whites).
- **Typography:** Expressive headings using serif fonts for a premium feel, and clean sans-serif for readability.
- **Key Features:**
  - Hero Section: High-impact introduction with expressive typography.
  - Feature Showcase: Interactive cards using modern CSS features like `:has()` and container queries.
  - Product List: A clean, grid-based layout for skincare products.
  - Interactive Elements: Buttons with "glow" effects and smooth transitions.
  - **Language Toggle:** A button to switch between English and Korean instantly.
  - **Affiliate Inquiry Form:** A professionally designed contact form using Formspree for handling partnership requests, supporting bilingual labels.
  - Mobile Responsiveness: Seamless experience across all devices.
  - Accessibility: Following A11Y standards for inclusivity.
- **Brand Status:** Brand-less/Neutral. "Lumina" branding has been removed for a clean, focus-on-product experience.

## Current Plan: Affiliate Inquiry Integration
1. **Update index.html:**
   - Add a new `affiliate-section` with a Formspree-powered form (`https://formspree.io/f/xeerjydz`).
   - Ensure all form fields and labels have bilingual support (`data-en` and `data-ko`).
2. **Update style.css:**
   - Style the form container with soft shadows and a clean layout.
   - Use a two-column grid for standard inputs and a full-width field for the message.
   - Ensure input focus states align with the brand's primary color.
3. **Verify:**
   - Check the form's layout and responsiveness.
   - Ensure the Formspree endpoint is correctly configured.
