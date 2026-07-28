export const FocusDurationOptionsMinutes = [15, 25, 50] as const;

export const DefaultDurationMinutes = 25;

export const CustomDurationMinutes = {
  min: 5,
  max: 180,
  step: 5,
} as const;

export const BackgroundGraceSeconds = 5;

export const StreakProtectionCooldownDays = 7;

export const MaxSessionRecords = 2000;
