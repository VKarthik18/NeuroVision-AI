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

# Stage mapping based on "severity score"
def assign_stage(score):
    if score <= 12:
        return "Mild"
    elif score <= 20:
        return "Moderate"
    else:
        return "Severe"

# Generate dataset
def generate_dataset(n=15000, filename="training_dataset.csv"):
    patients = []
    for i in range(1, n+1):
        patient = {"Patient_ID": f"P{i:05d}"}
        score = 0
        
        for q, choices in options.items():
            ans = random.choice(choices)
            patient[q] = ans
            score += choices.index(ans)  # severity index
        
        patient["Stage"] = assign_stage(score)
        patients.append(patient)

    df = pd.DataFrame(patients)
    df.to_csv(filename, index=False)
    print(f"Dataset saved as {filename} with {n} records.")

if __name__ == "__main__":
    generate_dataset()
