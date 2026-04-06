export const TRAIL_UNLOCK_THRESHOLD = 7
export const NO_EXIT_UNLOCK_THRESHOLD = 2

export interface GameAccessState {
  canAccessTrailOfShadows: boolean
  canAccessNoExit: boolean
  canAccessAIInterrogation: boolean
}

export function getGameAccessState(
  trailQuestionsCompleted: number,
  noExitChallengesCompleted: number
): GameAccessState {
  const canAccessTrailOfShadows = true
  const canAccessNoExit = trailQuestionsCompleted >= TRAIL_UNLOCK_THRESHOLD
  const canAccessAIInterrogation = noExitChallengesCompleted >= NO_EXIT_UNLOCK_THRESHOLD

  return {
    canAccessTrailOfShadows,
    canAccessNoExit,
    canAccessAIInterrogation
  }
}
