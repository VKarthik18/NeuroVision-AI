# File: backend/report_logic.py

# This dictionary maps each question ID to its cognitive category.
QUESTION_CATEGORIES = {
  'q1': 'Memory',
  'q2': 'Orientation',
  'q3': 'Cognitive',
  'q4': 'Language',
  'q5': 'ADLs',
  'q6': 'Behaviour',
  'q7': 'Caregiver',
  'q8': 'Memory',
  'q9': 'Orientation',
  'q10': 'ADLs',
}

# This dictionary maps every possible answer for every question to a difficulty level.
ANSWER_MAP = {
  # Q1: Can you recall recent events or conversations clearly?
  'q1': {
    "Yes, clearly": "No Difficulty",
    "Somewhat, not sure": "Mild Difficulty",
    "No, cannot recall": "Significant Difficulty",
  },
  # Q2: Can you correctly state the time, date, or place?
  'q2': {
    "Yes": "No Difficulty",
    "Approximate but not exact": "Mild Difficulty",
    "No idea": "Significant Difficulty",
  },
  # Q3: Can you follow instructions or tasks without reminders?
  'q3': {
    "Yes": "No Difficulty",
    "Need reminders": "Mild Difficulty",
    "Cannot follow": "Significant Difficulty",
  },
  # Q4: Do you struggle to find the right words when speaking?
  'q4': {
    "Rarely": "No Difficulty",
    "Sometimes": "Mild Difficulty",
    "Frequently": "Significant Difficulty",
  },
  # Q5: Do you have difficulty performing daily tasks like cooking or dressing?
  'q5': {
    "Independent": "No Difficulty",
    "Need some help": "Mild Difficulty",
    "Fully dependent": "Significant Difficulty",
  },
  # Q6: Have you noticed changes in your mood or personality?
  'q6': {
    "Rarely": "No Difficulty",
    "Sometimes": "Mild Difficulty",
    "Frequently": "Significant Difficulty",
  },
  # Q7: Can you manage your daily life independently?
  'q7': {
    "Yes": "No Difficulty",
    "Only for short time": "Mild Difficulty",
    "Not safe at all": "Significant Difficulty",
  },
  # Q8: Can you recall familiar faces, items, or important information?
  'q8': {
    "Yes, all": "No Difficulty",
    "Sometimes forget": "Mild Difficulty",
    "Rarely/never": "Significant Difficulty",
  },
  # Q9: Can you recognize your surroundings correctly?
  'q9': {
    "Yes": "No Difficulty",
    "Somewhat confused": "Mild Difficulty",
    "Not at all": "Significant Difficulty",
  },
  # Q10: Can you manage finances, shopping, and other routines safely?
  'q10': {
    "Always": "No Difficulty",
    "Sometimes forget": "Mild Difficulty",
    "Always need remainders": "Significant Difficulty",
  },
}
# File: backend/report_logic.py

# ... (keep QUESTION_CATEGORIES and ANSWER_MAP as they are) ...

# NEW: Add these detailed descriptions for each category
QUESTION_DESCRIPTIONS = {
    "q1": "* **Q1 (Memory):** The response suggests a potential challenge in recalling recent events or conversations clearly.",
    "q2": "* **Q2 (Orientation):** The response indicates a possible difficulty in accurately stating the time, date, or place.",
    "q3": "* **Q3 (Cognitive Function):** The answer suggests that following instructions or tasks without reminders might be a challenging area.",
    "q4": "* **Q4 (Language):** The response points to a potential difficulty in finding the right words when speaking.",
    "q5": "* **Q5 (Daily Tasks):** The answer indicates that some help may be needed with Activities of Daily Living (ADLs) like cooking or dressing.",
    "q6": "* **Q6 (Behaviour):** The response suggests that there may be noticeable changes in mood or personality.",
    "q7": "* **Q7 (Independence):** The answer about managing daily life suggests that ensuring a safe, independent environment may be a consideration.",
    "q8": "* **Q8 (Memory):** The response indicates a potential challenge in recalling familiar faces, items, or important information.",
    "q9": "* **Q9 (Orientation):** The answer suggests a degree of confusion regarding recognition of surroundings.",
    "q10": "* **Q10 (Complex Tasks):** The response points to potential difficulty in managing complex routines like finances or shopping safely."
}