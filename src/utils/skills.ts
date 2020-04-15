import { Skills } from '../types/skills';

export function sumSkillPoints(skills?: Skills): number {
  return Object.values(skills || []).reduce((total: number, value?: number) => (total += value || 0), 0);
}
