# SQL Jungle Adventure Game

SQL Jungle Adventure is an interactive 2D game for learning SQL concepts. The player must navigate through a jungle, encountering and defeating SQL concept monsters by correctly answering SQL challenges.

## Game Overview

- 2D side-scrolling adventure game with SQL education focus
- 13 levels, each teaching a different SQL concept
- Mix of free-form SQL query inputs and multiple-choice questions
- Progress tracking and integration with Edventure's story mode
- Character progression with health, XP, and unlockable powers
- Integration with the EduGuide character system for immersive experience
- Dynamic backgrounds from Unsplash that change with game progress

## Game Components

1. **GameEngine** - Main game component that manages state and game logic
2. **GameCharacter** - Renders the EduGuide character with different emotional states
3. **GameMonster** - Renders SQL monsters with basic animations
4. **GameWorld** - Renders dynamic Unsplash jungle backgrounds with parallax effect
5. **DialogBox** - Displays conversations with EduGuide emotions based on context
6. **SQLQueryInput** - Handles SQL query inputs and multiple-choice questions
7. **game-data.ts** - Contains all SQL monsters and their challenges

## SQL Concepts Covered

The game covers these 13 SQL concepts, each represented by a unique monster:

1. Databases & Tables (Tabular Titan)
2. Data Types (Type Trickster)
3. Constraints (Constrained Colossus)
4. DDL Commands (Schema Shifter)
5. DML Commands (Data Manipulator)
6. DCL Commands (Permission Phantom)
7. TCL Commands (Transaction Troll)
8. Joins (Join Jaguar)
9. Subqueries & Nested Queries (Nested Naga)
10. Views (Viewpoint Viper)
11. Indexes (Index Imp)
12. Stored Procedures & Functions (Procedure Poltergeist)
13. SQL Mastery (DataBase Dragon - final boss)

## Game Assets

The game uses the following assets:

- EduGuide character images (with different emotional states):
  - `/sql-game/eduguide/eduguide-happy.png` - Shows when player succeeds
  - `/sql-game/eduguide/eduguide-frustrated.png` - Shows when health is low or failure
  - `/sql-game/eduguide/eduguide-giving-advice.png` - Shows when providing hints
  - `/sql-game/eduguide/eduguide-says-hi.png` - Shows for greetings
  - `/sql-game/eduguide/eduguide-ready-for-quest.png` - Shows when character is moving
  - `/sql-game/eduguide/eduguide-ready-to-learn.jpeg.png` - Default idle state
  - `/sql-game/eduguide/eduguide-sad.png` - Shows after incorrect answers
  - `/sql-game/eduguide/eduguide-trophy.png` - Shows on victory screen

- Dynamic background images from Unsplash:
  - Different jungle-themed images based on game level
  - Progressive difficulty represented by more dense/mysterious jungles
  - Final boss level with dramatic dragon lair setting
  - Mid-layer and foreground imagery to create parallax effect

- Monster images from Unsplash:
  - Each SQL concept monster represented by a visually appropriate image
  - Images chosen to represent the concept (e.g., tables, constraints, joins)
  - Larger, more imposing image for the final DataBase Dragon boss

- UI elements:
  - Game preview image from Unsplash showing jungle coding environment
  - Featured banner on the story mode page 

## EduGuide Character Integration

The game features the EduGuide character in various emotional states to enhance the learning experience:

1. **Context-Aware Emotions** - EduGuide's expression changes based on the dialogue content and game state
2. **Health-Based Visualization** - EduGuide looks frustrated when health is low
3. **Victory Celebration** - Special trophy animation when the game is completed
4. **Dialog Context** - Different emotions for teaching, celebrating success, or showing concern after failures
5. **Animation States** - Different poses for moving vs. idle states

## Dynamic Background System

The game features a dynamic background system that changes as the player progresses:

1. **Level-Based Environments** - Background images change based on the level/monster
2. **Parallax Effect** - Multiple image layers move at different speeds for depth
3. **Progressive Difficulty Visualization** - Environments become more challenging-looking as the player advances
4. **Final Boss Environment** - Special dramatic background for the Database Dragon
5. **Responsive to Movement** - Background elements respond to player movement for immersion

## How to Add a New Monster

To add a new SQL concept monster:

1. Add a new monster object to the `SQLMonsters` array in `game-data.ts`
2. Select an appropriate Unsplash image for the new monster
3. Configure the challenge, correct answers, and dialog text
4. Update the total levels count in the progress tracking system

Example monster object:

```typescript
{
  id: 14,
  name: "Query Qraken",
  concept: "Advanced Queries",
  image: "https://images.unsplash.com/photo-appropriate-image-url",
  greeting: "I am Query Qraken! Master of complex SQL queries!",
  challenge: "Write an advanced query combining multiple concepts!",
  task: "Create a query that uses JOIN, GROUP BY, and HAVING in a single statement",
  hint: "Start with a SELECT statement and build from there...",
  skill: "Advanced Querying",
  defeatMessage: "Impressive! You've mastered advanced SQL queries!",
  challengeType: "query",
  correctQueries: ["SELECT", "JOIN", "GROUP BY", "HAVING"]
}
```

## Game Integration

The SQL Jungle Adventure integrates with Edventure's story mode through the `sql-game-integration.ts` file, which:

1. Tracks player progress
2. Awards XP for completing levels
3. Records unlocked skills and concepts
4. Manages completion status
5. Persists progress using localStorage (in a real implementation, this would use a database)

## Image Credits

All images used in the game are from Unsplash, a source for freely-usable images. The specific images were selected to represent:

1. Different jungle environments that progressively change with game difficulty
2. SQL concept monsters that visually represent their database concept
3. Game UI elements for an immersive experience

## Future Enhancements

Potential future enhancements for the game:

1. More sophisticated query validation
2. Additional animation states for characters and monsters
3. Sound effects and background music
4. More varied backgrounds and visual effects
5. Difficulty levels for different player skill levels
6. Community leaderboard to track fastest completion times
7. More integration with the EduGuide character system for personalized guidance 
8. Animated transitions between different background environments 