import { monsterImages } from './game-images';

export interface MonsterType {
  id: number
  name: string
  concept: string
  image: string
  greeting: string
  challenge: string
  task: string
  hint?: string
  skill: string
  defeatMessage: string
  challengeType: 'query' | 'option'
  correctQueries?: string[]
  options?: string[]
  correctOption?: string
}

// SQL Monsters with unique names and personalities
export const SQLMonsters: MonsterType[] = [
  // Level 1: Databases & Tables
  {
    id: 1,
    name: "Tabular Titan",
    concept: "Databases & Tables",
    image: monsterImages.tabularTitan,
    greeting: "ROAR! I am Tabular Titan, guardian of the data structures! You can't escape the jungle without understanding how to organize data!",
    challenge: "Create a table to store data about explorers like yourself!",
    task: "Write a CREATE TABLE statement for a table named 'explorers' with columns for id (integer, primary key), name (varchar), and level (integer).",
    hint: "Use CREATE TABLE tablename (column_definitions);",
    skill: "Table Creation",
    defeatMessage: "Impressive! You've mastered the art of creating tables! Tables are the foundation of any database, providing structure to your data.",
    challengeType: "query",
    correctQueries: ["CREATE TABLE explorers", "PRIMARY KEY", "VARCHAR", "INTEGER"]
  },
  
 
]; 