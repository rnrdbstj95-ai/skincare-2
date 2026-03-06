# SkinIntel AI Project Blueprint (EXIT Strategy)

## Project Overview
A high-value, AI-driven skincare diagnosis platform designed for acquisition (EXIT). The site provides professional skin analysis, ingredient matching, and curated product recommendations based on individual skin profiles.

## Project Outline
- **Unique Value Proposition (UVP):** "Intelligence over Guesswork." Automated skin profiling using interactive quizzes and AI photo analysis.
- **Key Features:**
  - **AI Skin Diagnosis:** Step-by-step interactive system to identify skin types (Oily, Dry, Dehydrated, Sensitive).
  - **Ingredient Science:** Content focused on clinically-backed, EWG Green Grade ingredients (Centella, Ceramide).
  - **Match-Rate System:** Products recommended with a star-rating suitability score.
  - **Monetization Ready:** Affiliate-ready product cards and AdSense integration.
  - **Bilingual Interface:** Optimized for Global and Korean markets.
- **Legal/Trust:** Privacy Policy specifically covering health/diagnosis data.

## Current Plan: Targeted Diagnosis for Dehydrated Oily Skin
1. **Symptom-Specific Quiz Expansion:**
   - Add specific symptoms to the quiz: Inner dryness, T-zone oiliness vs. U-zone dryness, sensitivity to environmental factors (AC/Heater), and emotional flushing.
   - Map these symptoms to the "Dehydrated Oily & Sensitive" (수부지/민감성) profile.
2. **Personalized Solution Implementation:**
   - Update `DiagnosisSystem` in `main.js` to recognize the combination of "oily surface but inner tightness" and "sensitivity."
   - Recommend ingredients like Panthenol, Allantoin, and Squalane for barrier repair without heavy oiliness.
3. **Visual & Interactive Enhancements:**
   - Use CSS gradients and subtle textures to create a premium feel.
   - Ensure the "Analyze Now" button provides a detailed, satisfying feedback loop.
4. **Verification & Testing:**
   - Verify that selecting multiple symptoms leads to the correct personalized recommendation.
