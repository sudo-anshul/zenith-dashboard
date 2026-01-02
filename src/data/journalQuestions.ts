export const DAILY_QUESTIONS = [
    "What did I do today that actually moved my life forward?\n(Something that pushed studies, skills, health, or relationships — even 1% progress counts.)",
    "What was the one most important task I completed today?\n(If only one thing mattered today, this was it.)",
    "What distracted me the most today, and when did it happen?\n(Name the trigger: phone, thoughts, people, time of day.)",
    "What did I learn or understand better today (even something small)?\n(Concept, mistake, insight — write it in your own words.)",
    "How was my energy today (low / medium / high), and why?\n(Sleep, food, exercise, stress, or environment.)",
    "Which habit did I follow today? Which one did I skip?\n(Be factual — no excuses, just yes/no.)",
    "What emotion dominated my day, and what triggered it?\n(Stress, calm, motivation, frustration — identify the cause.)",
    "What would I do differently if I replayed today once?\n(One clear change, not a long list.)",
    "What am I grateful for today?\n(Something specific, not generic.)",
    "What is the one clear priority for tomorrow?\n(If this gets done, tomorrow is a win.)"
];

export const WEEKLY_QUESTIONS = [
    "What were my 3 biggest wins this week (academic, personal, health)?\n→ Even small wins count. Momentum matters.",
    "Which habit was most consistent this week? Which one broke first?\n→ Consistency > intensity.",
    "What wasted the most time or energy this week?\n→ Be specific: app, person, time slot, mood.",
    "What did I learn this week that actually improved my skills or thinking?\n→ DSA concept, coding pattern, life insight.",
    "How many days did I genuinely try (not just “felt busy”)?\n→ Count effort days, not perfect days.",
    "What pattern do I notice in my productivity or mood?\n→ Time of day, environment, sleep, phone usage.",
    "What mistake did I repeat — and why?\n→ Awareness is the first fix.",
    "Did my actions align with my long-term goals this week? Why or why not?\n→ Brutal honesty here = growth.",
    "What is one thing I should STOP doing next week?\n→ Removal often beats addition.",
    "What are my top 3 priorities for next week (non-negotiable)?\n→ If everything is important, nothing is."
];

export const MONTHLY_QUESTIONS = [
    "What were my top 5 wins this month?\n(Academic, skill, health, relationship, mindset — list at least one.)",
    "Which habits stuck most consistently this month? Which ones failed completely?\n(Be factual, not emotional.)",
    "Where did I make the most real progress toward my long-term goals?\n(DSA, internships, projects, discipline, confidence.)",
    "What consumed most of my time this month — and was it worth it?\n(Name the activities honestly.)",
    "What skill or concept improved the most this month?\n(If unclear → that’s a signal.)",
    "What pattern keeps repeating in my productivity, mood, or procrastination?\n(Same excuse = same result.)",
    "What was the biggest mistake or setback this month — and what did it teach me?\n(Turn pain into data.)",
    "Did I live this month intentionally or reactively? Why?\n(This question alone is powerful.)",
    "What should I STOP, START, and CONTINUE next month?\nSTOP:\nSTART:\nCONTINUE:",
    "If next month were “successful,” what would be different by the end of it?\n(Clear outcomes, not vague feelings.)"
];

export const getQuestionsForDate = (date: Date): { type: 'daily' | 'weekly' | 'monthly', questions: string[] } => {
    // Check for Monthly (Last day of month)
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If tomorrow is the 1st, then today is the last day of the month
    if (tomorrow.getDate() === 1) {
        return { type: 'monthly', questions: MONTHLY_QUESTIONS };
    }

    // Check for Weekly (Sunday)
    // getDay() returns 0 for Sunday
    if (date.getDay() === 0) {
        return { type: 'weekly', questions: WEEKLY_QUESTIONS };
    }

    // Default to Daily
    return { type: 'daily', questions: DAILY_QUESTIONS };
};
