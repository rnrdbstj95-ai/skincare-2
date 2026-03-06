# SkinIntel AI Project Blueprint (EXIT Strategy)

## Project Overview
A high-value, AI-driven skincare diagnosis platform designed for acquisition (EXIT). The site provides professional skin analysis, ingredient matching, and curated product recommendations based on individual skin profiles.

## Project Outline
- **Unique Value Proposition (UVP):** "Intelligence over Guesswork." Automated skin profiling using interactive quizzes and AI photo analysis.
- **Key Features:**
  - **3-Category Diagnosis System:**
    1. **Basic Skin Type (Oil & Moisture):** Identifies base profile (Oily, Dry, Combo, Dehydrated).
    2. **Sensitivity & Barrier Strength:** Maps "triggers" and reactivity levels.
    3. **Makeup & Lifestyle Pain Points:** Addresses real-world application issues (Darkening, Cakey-ness).
  - **UX Enhancements:** Progress bar, dynamic question loading, and visual feedback.
  - **Weighted Scoring Algorithm:** Each answer adds points to specific profiles (e.g., "Tight after wash" = +3 Dry, "Midday oily T-zone" = +3 Oily).
  - **Bilingual Interface:** Optimized for Global and Korean markets.
- **Legal/Trust:** Privacy Policy specifically covering health/diagnosis data.

## Current Plan: Advanced Diagnosis Implementation (Checklist UX)
1. **Checklist Question Engine:**
   - Update `main.js` to render ALL questions belonging to a selected category on a single page.
   - Users can scroll and multi-select all symptoms that apply to them.
2. **UX & Progress Tracking:**
   - Replace the step-by-step progress bar with a category-wide completion indicator or simplify the header.
   - Add a prominent "Analyze My Skin" button at the bottom of the checklist.
3. **Algorithm & Result Generation:**
   - Maintain the weighted scoring engine to calculate the final profile based on the checklist selections.
4. **Verification & Testing:**
   - Ensure that selecting multiple items in the checklist correctly aggregates scores.
   - Verify smooth scrolling and clear "Selected" visual states.
