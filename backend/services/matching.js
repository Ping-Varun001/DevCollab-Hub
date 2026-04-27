// Calculate match percentage between user skills and project required skills
export const calculateMatchPercentage = (userSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 100;
    if (!userSkills || userSkills.length === 0) return 0;

    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
    const commonSkills = requiredSkills.filter(skill => 
        userSkillsLower.includes(skill.toLowerCase())
    );

    const match = (commonSkills.length / requiredSkills.length) * 100;
    return Math.round(match);
};
