import pandas as pd
import random

# Dropdown options for each question
options = {
    "Q1_Memory": ["Yes, clearly", "Somewhat, not sure", "No, cannot recall"],
    "Q2_Orientation": ["Yes", "Approximate but not exact", "No idea"],
    "Q3_Cognitive": ["Yes", "Need reminders", "Cannot follow"],
    "Q4_Language": ["Rarely", "Sometimes", "Frequently"],
    "Q5_ADLs": ["Independent", "Need some help", "Fully dependent"],
    "Q6_Behavior": ["Rarely", "Sometimes", "Frequently"],
    "Q7_Caregiver": ["Yes", "Only for short time", "Not safe at all"],
    "Q8_Memory": ["Yes, all", "Sometimes forget", "Rarely/never"],
    "Q9_Orientation": ["Yes", "Somewhat confused", "Not at all"],
    "Q10_ADLs": ["Always", "Sometimes forget", "Always need reminders"]
}

# Stage mapping based on severity percentage
def assign_stage(score, max_score):
    pct = score / max_score
    if pct <= 0.1:
        return "Normal"
    elif pct <= 0.4:
        return "Mild"
    elif pct <= 0.7:
        return "Moderate"
    else:
        return "Severe"

# Pick answers for a target stage
def pick_answers_for_stage(target_stage, max_score):
    while True:
        patient_ans = {}
        score = 0
        for q, choices in options.items():
            ans = random.choice(choices)
            patient_ans[q] = ans
            score += choices.index(ans)
        pct = score / max_score
        if target_stage == "Normal" and pct <= 0.1:
            return patient_ans
        elif target_stage == "Mild" and 0.1 < pct <= 0.4:
            return patient_ans
        elif target_stage == "Moderate" and 0.4 < pct <= 0.7:
            return patient_ans
        elif target_stage == "Severe" and pct > 0.7:
            return patient_ans

# Generate dataset
def generate_dataset(n=20000, filename="training_dataset.csv"):
    patients = []
    max_score = sum([len(choices)-1 for choices in options.values()])
    stages = ["Normal", "Mild", "Moderate", "Severe"]
    n_per_stage = n // 4

    for stage in stages:
        for _ in range(n_per_stage):
            patient = {"Patient_ID": f"P{len(patients)+1:05d}"}
            patient.update(pick_answers_for_stage(stage, max_score))
            patient["Stage"] = stage
            patients.append(patient)

    df = pd.DataFrame(patients)
    df.to_csv(filename, index=False)
    print(f"Dataset saved as {filename} with {len(patients)} records.")

if __name__ == "__main__":
    generate_dataset()
