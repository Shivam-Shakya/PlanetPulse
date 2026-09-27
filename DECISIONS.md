# PlanetPulse — Decision Points

## DP1 · The Nudge
**Decision:** The app provides context-aware, encouraging, and actionable feedback rather than shaming or blocking the user. When a target is crossed, it displays a gentle warning suggesting alternatives (e.g., "Your weekly footprint is above your target. Consider a lower-carbon commute or meal choice next week.").

**Why:** 
Climate action tracking can easily become overwhelming or guilt-inducing, which is a primary reason users abandon habit-tracking apps. By acting as a supportive coach rather than a strict judge, we prevent "eco-anxiety" and user drop-off. Positive reinforcement when users are doing well, combined with actionable, non-judgmental advice when they exceed limits, fosters long-term retention and genuine behavioral change.

---

## DP2 · Absurd Input
**Decision:** The app implements "soft" validation thresholds (e.g., > 5,000 km for a car trip) that trigger a warning modal. The app alerts the user that the input looks unusually high and offers two choices: "[Edit]" or "[Yes, Save]". 

**Why:** 
Users frequently make typos (like adding too many zeros), and blindly accepting these absurd inputs would completely ruin their dashboard statistics and weekly tracking. However, strictly blocking inputs removes user autonomy; a user might genuinely be recording an edge-case scenario like a cross-country road trip. The "Save Anyway" intercept strikes the perfect balance by preventing accidental bad data while completely respecting the user's explicit intent.

---

## DP3 · The Week
**Decision:** A week is strictly defined as Monday 00:00 to Sunday 23:59 based on the user's local timezone. Mid-week progress is visualized on the dashboard using a live progress bar that shows current consumption versus the total target, updating instantly as new activities are logged.

**Why:** 
Monday serves as the psychological start of the workweek for most users, making it the most intuitive cycle for tracking daily routines and commute-heavy days. By calculating progress strictly on local time and showing it dynamically against a fixed weekly target, users get an immediate sense of how their early-week choices impact their "carbon budget" for the weekend. This creates a clear, predictable rhythm that helps users pace their environmental footprint.