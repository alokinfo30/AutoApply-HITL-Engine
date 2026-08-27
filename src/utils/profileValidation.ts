import { CandidateProfile } from '../types';

export interface ProfileCompletionResult {
  percentage: number;
  is100Percent: boolean;
  hasRoles: boolean;
  hasCountries: boolean;
  isReadyForStage2: boolean;
  missingRequirements: string[];
  fieldScores: {
    contactInfo: boolean;
    nativeCountry: boolean;
    summary: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    roles: boolean;
    countries: boolean;
  };
}

/**
 * Validates candidate profile completion, target roles, and target countries
 */
export function calculateProfileCompletion(profile: Partial<CandidateProfile> | null | undefined): ProfileCompletionResult {
  if (!profile) {
    return {
      percentage: 0,
      is100Percent: false,
      hasRoles: false,
      hasCountries: false,
      isReadyForStage2: false,
      missingRequirements: [
        'Complete basic contact details (Name, Email, Phone, Location)',
        'Specify your Native Country / Current Location',
        'Add a Professional Summary',
        'Add at least 3 core technical skills',
        'Add at least 1 work experience record',
        'Add at least 1 education entry',
        'Select at least 1 Target Role',
        'Select at least 1 Target Country'
      ],
      fieldScores: {
        contactInfo: false,
        nativeCountry: false,
        summary: false,
        skills: false,
        experience: false,
        education: false,
        roles: false,
        countries: false
      }
    };
  }

  const missing: string[] = [];

  // 1. Basic Contact Info (20%)
  const hasFirstName = Boolean(profile.firstName && profile.firstName.trim().length > 0);
  const hasLastName = Boolean(profile.lastName && profile.lastName.trim().length > 0);
  const hasEmail = Boolean(profile.email && profile.email.includes('@'));
  const hasPhone = Boolean(profile.phone && profile.phone.trim().length >= 6);
  const hasLocation = Boolean(profile.currentLocation && profile.currentLocation.trim().length > 0);
  const contactInfoValid = hasFirstName && hasLastName && hasEmail && hasPhone && hasLocation;
  if (!contactInfoValid) {
    missing.push('Full Contact Info (Name, Email, Phone, and Current Location)');
  }

  // 2. Native Country / Citizenship (10%)
  const nativeCountryValid = Boolean(profile.nativeCountry && profile.nativeCountry.trim().length > 0) || hasLocation;
  if (!nativeCountryValid) {
    missing.push('Native Country / Citizenship');
  }

  // 3. Professional Summary (15%)
  const summaryValid = Boolean(profile.summary && profile.summary.trim().length >= 25);
  if (!summaryValid) {
    missing.push('Professional Summary (at least 25 characters)');
  }

  // 4. Skills (15%)
  const skillsValid = Boolean(profile.skills && profile.skills.length >= 3);
  if (!skillsValid) {
    missing.push('Technical Skills (at least 3 skills)');
  }

  // 5. Work Experience (20%)
  const experienceValid = Boolean(
    profile.experience && 
    profile.experience.length >= 1 && 
    profile.experience[0].company && 
    profile.experience[0].role
  );
  if (!experienceValid) {
    missing.push('Work Experience (at least 1 company & role record)');
  }

  // 6. Education (20%)
  const educationValid = Boolean(
    profile.education && 
    profile.education.length >= 1 && 
    profile.education[0].degree && 
    profile.education[0].institution
  );
  if (!educationValid) {
    missing.push('Education (at least 1 degree & institution entry)');
  }

  // Target Roles & Countries checks
  const hasRoles = Boolean(profile.targetRoles && profile.targetRoles.length > 0);
  if (!hasRoles) {
    missing.push('Target Role(s) (select or add at least 1 desired job title)');
  }

  const hasCountries = Boolean(profile.targetCountries && profile.targetCountries.length > 0);
  if (!hasCountries) {
    missing.push('Target Country/Countries (select at least 1 destination or domestic market)');
  }

  // Calculate Base Profile Form Completion Percentage (100% when all 6 profile sections are valid)
  let score = 0;
  if (contactInfoValid) score += 20;
  if (nativeCountryValid) score += 10;
  if (summaryValid) score += 15;
  if (skillsValid) score += 15;
  if (experienceValid) score += 20;
  if (educationValid) score += 20;

  const percentage = Math.min(100, score);
  const is100Percent = percentage === 100;
  const isReadyForStage2 = is100Percent && hasRoles && hasCountries;

  return {
    percentage,
    is100Percent,
    hasRoles,
    hasCountries,
    isReadyForStage2,
    missingRequirements: missing,
    fieldScores: {
      contactInfo: contactInfoValid,
      nativeCountry: nativeCountryValid,
      summary: summaryValid,
      skills: skillsValid,
      experience: experienceValid,
      education: educationValid,
      roles: hasRoles,
      countries: hasCountries
    }
  };
}

/**
 * Determines if a target country or location corresponds to candidate's native country
 */
export function isCandidateNativeCountry(
  targetCountryOrLocation: string, 
  profile?: CandidateProfile | null
): boolean {
  if (!targetCountryOrLocation || !profile) return false;
  
  const targetLower = targetCountryOrLocation.toLowerCase().trim();
  
  // Check explicit nativeCountry field
  if (profile.nativeCountry) {
    const nativeLower = profile.nativeCountry.toLowerCase().trim();
    if (targetLower.includes(nativeLower) || nativeLower.includes(targetLower)) {
      return true;
    }
  }

  // Check currentLocation field
  if (profile.currentLocation) {
    const locationLower = profile.currentLocation.toLowerCase().trim();
    if (locationLower.includes(targetLower) || targetLower.includes(locationLower)) {
      return true;
    }
    // Extract country after comma if present (e.g. "Lucknow, India")
    const parts = locationLower.split(',').map(s => s.trim());
    if (parts.length > 1) {
      const countryPart = parts[parts.length - 1];
      if (countryPart && (targetLower.includes(countryPart) || countryPart.includes(targetLower))) {
        return true;
      }
    }
  }

  return false;
}
