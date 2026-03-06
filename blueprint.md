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

## Current Plan: Advanced Diagnosis Implementation
1. **Dynamic Question Engine:**
   - Define a JSON-like data structure in `main.js` containing all symptoms with their weighted scores and categories.
   - Implement logic to select and display questions based on the user's chosen entry point (Type, Sensitivity, or Makeup).
2. **UX & Progress Tracking:**
   - Add a functional Progress Bar to the diagnosis card.
   - Implement "Next/Back" logic with automated scroll-to-top for smooth transitions.
3. **Algorithm & Result Generation:**
   - Create a scoring engine that calculates the final profile based on accumulated weights.
   - Map scores to detailed "Skin Reports" and product recommendations.
4. **Verification & Testing:**
   - Ensure the "Makeup" button leads to the correct Category 3 quiz.
   - Verify that weighted sums correctly identify "Dehydrated Oily" (High Oil + High Dry scores).
