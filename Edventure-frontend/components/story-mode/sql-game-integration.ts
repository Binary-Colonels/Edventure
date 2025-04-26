// SQL Game integration with Story Mode

export interface SQLGameProgress {
  levelsCompleted: number
  totalLevels: number
  conceptsLearned: string[]
  skillsUnlocked: string[]
  xpEarned: number
  completionStatus: 'not-started' | 'in-progress' | 'completed'
}

// Initial state when a user hasn't started the SQL adventure
export const initialSQLGameProgress: SQLGameProgress = {
  levelsCompleted: 0,
  totalLevels: 13,
  conceptsLearned: [],
  skillsUnlocked: [],
  xpEarned: 0,
  completionStatus: 'not-started'
}

// In a real implementation, these functions would interact with a database
// or API to track user progress throughout the SQL game

export function getSQLGameProgress(): SQLGameProgress {
  // This is a mock implementation
  // In a real app, this would fetch from an API or local storage
  const savedProgress = localStorage.getItem('sql-game-progress')
  if (savedProgress) {
    return JSON.parse(savedProgress) as SQLGameProgress
  }
  return initialSQLGameProgress
}

export function updateSQLGameProgress(progress: Partial<SQLGameProgress>): SQLGameProgress {
  // This is a mock implementation
  // In a real app, this would update via an API call
  const currentProgress = getSQLGameProgress()
  const updatedProgress = {
    ...currentProgress,
    ...progress,
  }
  
  // Auto-update completion status based on levels completed
  if (updatedProgress.levelsCompleted === 0) {
    updatedProgress.completionStatus = 'not-started'
  } else if (updatedProgress.levelsCompleted === updatedProgress.totalLevels) {
    updatedProgress.completionStatus = 'completed'
  } else {
    updatedProgress.completionStatus = 'in-progress'
  }
  
  // Persist the changes
  localStorage.setItem('sql-game-progress', JSON.stringify(updatedProgress))
  
  // In a real app, you'd notify the server about progress
  // For now, we just return the updated progress
  return updatedProgress
}

// Award XP for completing levels and defeating monsters
export function awardXP(levelCompleted: number): number {
  // Base XP for completing a level
  let xpAwarded = 50
  
  // Bonus XP for higher levels
  xpAwarded += levelCompleted * 10
  
  return xpAwarded
}

// Map of skills earned from each level
export const skillRewards = {
  1: 'Table Creation',
  2: 'Data Type Selection',
  3: 'Database Constraints',
  4: 'Schema Modification',
  5: 'Data Manipulation',
  6: 'Access Control',
  7: 'Transaction Management',
  8: 'Table Joining',
  9: 'Nested Querying',
  10: 'View Creation',
  11: 'Index Optimization',
  12: 'ProcEdventurel SQL',
  13: 'SQL Mastery'
} 