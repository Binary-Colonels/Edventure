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
  
  // Level 2: Data Types
  {
    id: 2,
    name: "Type Trickster",
    concept: "Data Types",
    image: monsterImages.typeTrickster,
    greeting: "Hehehe! I'm Type Trickster, master of confusion! Your data will be a mess unless you know your types!",
    challenge: "Choose the correct data types for a database storing information about jungle animals!",
    task: "Select the correct option that uses appropriate data types.",
    skill: "Data Type Selection",
    defeatMessage: "Well done! You understand the importance of choosing the right data types for your data. This keeps your database efficient and accurate!",
    challengeType: "option",
    options: [
      "CREATE TABLE animals (id INTEGER, name VARCHAR(50), weight FLOAT, is_predator BOOLEAN, description TEXT);",
      "CREATE TABLE animals (id VARCHAR(10), name INTEGER, weight VARCHAR(20), is_predator TEXT, description VARCHAR(50));",
      "CREATE TABLE animals (id TEXT, name INTEGER, weight DATE, is_predator FLOAT, description INTEGER);",
      "CREATE TABLE animals (id BOOLEAN, name DATETIME, weight VARCHAR(50), is_predator INTEGER, description FLOAT);"
    ],
    correctOption: "CREATE TABLE animals (id INTEGER, name VARCHAR(50), weight FLOAT, is_predator BOOLEAN, description TEXT);"
  },
  
  // Level 3: Constraints
  {
    id: 3,
    name: "Constrained Colossus",
    concept: "Constraints",
    image: monsterImages.constrainedColossus,
    greeting: "HALT! I am Constrained Colossus! Your data must follow RULES to pass through my territory!",
    challenge: "Add constraints to ensure data integrity in your jungle inventory table!",
    task: "Add PRIMARY KEY, FOREIGN KEY, UNIQUE, and NOT NULL constraints to the given table.",
    hint: "Remember to use the correct constraint syntax for each type of rule.",
    skill: "Database Constraints",
    defeatMessage: "Excellent! Constraints are crucial for maintaining data integrity. They ensure your data follows the rules you set for it.",
    challengeType: "query",
    correctQueries: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL"]
  },
  
  // Level 4: DDL Commands
  {
    id: 4,
    name: "Schema Shifter",
    concept: "DDL Commands",
    image: monsterImages.schemaShifter,
    greeting: "I am Schema Shifter! Master of structure and change! Show me you can adapt your database as needs evolve!",
    challenge: "Modify an existing table structure to accommodate new data requirements!",
    task: "Use ALTER TABLE to add a new column called 'last_seen_date' (DATE type) to the 'animals' table.",
    hint: "ALTER TABLE table_name ADD COLUMN column_definition;",
    skill: "Schema Modification",
    defeatMessage: "Superb! DDL commands like CREATE, ALTER, and DROP allow you to define and modify the structure of your database objects.",
    challengeType: "query",
    correctQueries: ["ALTER TABLE animals", "ADD COLUMN", "last_seen_date", "DATE"]
  },
  
  // Level 5: DML Commands
  {
    id: 5,
    name: "Data Manipulator",
    concept: "DML Commands",
    image: monsterImages.dataManipulator,
    greeting: "Mwahaha! I'm Data Manipulator! Master of CRUD operations! Can you handle the data flowing through my veins?",
    challenge: "Demonstrate your ability to manipulate data in a table!",
    task: "Write an INSERT statement to add a new explorer with id=5, name='Alex', and level=3 to the 'explorers' table.",
    hint: "INSERT INTO table_name (columns) VALUES (values);",
    skill: "Data Manipulation",
    defeatMessage: "Fantastic! DML commands (SELECT, INSERT, UPDATE, DELETE) are essential for working with the actual data in your database.",
    challengeType: "query",
    correctQueries: ["INSERT INTO explorers", "VALUES", "(5", "'Alex'", "3)"]
  },
  
  // Level 6: DCL Commands
  {
    id: 6,
    name: "Permission Phantom",
    concept: "DCL Commands",
    image: monsterImages.permissionPhantom,
    greeting: "Ooooooh! I am Permission Phantom! Guardian of database security! Prove you can manage who accesses what!",
    challenge: "Control database access appropriately!",
    task: "Choose the correct DCL statement to give a user named 'jungle_ranger' SELECT and INSERT permissions on the 'animals' table.",
    skill: "Access Control",
    defeatMessage: "Well done! DCL commands control who can access and modify data, ensuring security and proper permissions management.",
    challengeType: "option",
    options: [
      "GRANT SELECT, INSERT ON animals TO jungle_ranger;",
      "ALLOW SELECT, INSERT FROM animals TO jungle_ranger;",
      "PERMIT jungle_ranger TO SELECT, INSERT ON animals;",
      "SELECT, INSERT = 'jungle_ranger' ON TABLE animals;"
    ],
    correctOption: "GRANT SELECT, INSERT ON animals TO jungle_ranger;"
  },
  
  // Level 7: Transaction Troll
  {
    id: 7,
    name: "Transaction Troll",
    concept: "TCL Commands",
    image: monsterImages.transactionTroll,
    greeting: "Grrrr! I'm Transaction Troll! Master of all-or-nothing operations! Can you keep your data consistent?",
    challenge: "Manage a transaction that involves multiple operations!",
    task: "Put these commands in the correct order to perform a safe transaction updating inventory after an item is used.",
    skill: "Transaction Management",
    defeatMessage: "Perfect! Transaction Control Language commands ensure that related operations either all succeed or all fail, maintaining data consistency.",
    challengeType: "option",
    options: [
      "BEGIN TRANSACTION; UPDATE inventory SET quantity = quantity - 1 WHERE item_id = 101; UPDATE explorer_items SET uses_left = uses_left - 1 WHERE explorer_id = 7 AND item_id = 101; COMMIT;",
      "START; UPDATE inventory; UPDATE explorer_items; END TRANSACTION;",
      "TRANSACTION START; UPDATE inventory SET quantity - 1; UPDATE explorer_items SET uses_left - 1; TRANSACTION END;",
      "UPDATE inventory SET quantity = quantity - 1 WHERE item_id = 101; UPDATE explorer_items SET uses_left = uses_left - 1; SAVE;"
    ],
    correctOption: "BEGIN TRANSACTION; UPDATE inventory SET quantity = quantity - 1 WHERE item_id = 101; UPDATE explorer_items SET uses_left = uses_left - 1 WHERE explorer_id = 7 AND item_id = 101; COMMIT;"
  },
  
  // Level 8: Joins
  {
    id: 8,
    name: "Join Jaguar",
    concept: "Joins",
    image: monsterImages.joinJaguar,
    greeting: "ROARR! I am Join Jaguar! Master of connecting related data! Show me you can link information from different tables!",
    challenge: "Connect data from related tables to get complete information!",
    task: "Write a query using INNER JOIN to get explorer names and their corresponding item names from 'explorers' and 'items' tables using 'explorer_items' as a junction table.",
    hint: "You'll need to join tables using their relationship keys.",
    skill: "Table Joining",
    defeatMessage: "Excellent! Joins allow you to combine related data from multiple tables, giving you a complete view of your information.",
    challengeType: "query",
    correctQueries: ["SELECT", "FROM explorers", "INNER JOIN", "explorer_items", "items"]
  },
  
  // Level 9: Subqueries & Nested Queries
  {
    id: 9,
    name: "Nested Naga",
    concept: "Subqueries & Nested Queries",
    image: monsterImages.nestedNaga,
    greeting: "Ssssss! I am Nested Naga! Master of queries within queries! Can you solve problems that require multiple levels of thinking?",
    challenge: "Use a subquery to find complex information!",
    task: "Write a query to find explorers who have collected more items than the average explorer.",
    hint: "You'll need a subquery to calculate the average number of items per explorer.",
    skill: "Nested Querying",
    defeatMessage: "Impressive! Subqueries allow you to perform complex operations by nesting one query inside another.",
    challengeType: "query",
    correctQueries: ["SELECT", "FROM explorers", "WHERE", "COUNT", "GROUP BY", "HAVING", "SELECT AVG"]
  },
  
  // Level 10: Views
  {
    id: 10,
    name: "Viewpoint Viper",
    concept: "Views",
    image: monsterImages.viewpointViper,
    greeting: "Hisssss! I'm Viewpoint Viper! Master of perspectives! Show me you can create simplified ways to see complex data!",
    challenge: "Create a virtual table to simplify a complex query!",
    task: "Create a VIEW named 'active_explorers' that shows explorers with level > 5 and their count of collected items.",
    hint: "CREATE VIEW view_name AS SELECT...",
    skill: "View Creation",
    defeatMessage: "Well done! Views create virtual tables based on queries, simplifying complex data access and hiding complicated query logic.",
    challengeType: "query",
    correctQueries: ["CREATE VIEW active_explorers", "AS SELECT", "FROM explorers", "WHERE level > 5", "JOIN", "GROUP BY"]
  },
  
  // Level 11: Indexes
  {
    id: 11,
    name: "Index Imp",
    concept: "Indexes",
    image: monsterImages.indexImp,
    greeting: "Teehee! I'm Index Imp! Performance is my game! Can you make your database queries faster?",
    challenge: "Optimize query performance with indexes!",
    task: "Create an index on the 'name' column of the 'items' table for faster searching.",
    hint: "CREATE INDEX index_name ON table_name(column_name);",
    skill: "Index Optimization",
    defeatMessage: "Perfect! Indexes significantly speed up data retrieval operations but need to be used wisely as they add overhead to data modification.",
    challengeType: "query",
    correctQueries: ["CREATE INDEX", "ON items", "name"]
  },
  
  // Level 12: Stored Procedures & Functions
  {
    id: 12,
    name: "Procedure Poltergeist",
    concept: "Stored Procedures & Functions",
    image: monsterImages.procedurePoltergeist,
    greeting: "Booooo! I am Procedure Poltergeist! Master of reusable SQL logic! Show me you can create efficient, reusable code!",
    challenge: "Create a stored procedure to simplify a common operation!",
    task: "Write a stored procedure named 'add_explorer' that inserts a new explorer with parameters for name and level.",
    hint: "CREATE PROCEDURE procedure_name (parameters) AS BEGIN...END;",
    skill: "ProcEdventurel SQL",
    defeatMessage: "Excellent! Stored procedures and functions allow you to encapsulate and reuse SQL logic, improving maintainability and performance.",
    challengeType: "query",
    correctQueries: ["CREATE PROCEDURE add_explorer", "PARAMETER", "BEGIN", "INSERT INTO explorers", "END"]
  },
  
  // Level 13: Final Boss - combines multiple concepts
  {
    id: 13,
    name: "DataBase Dragon",
    concept: "SQL Mastery",
    image: monsterImages.databaseDragon,
    greeting: "BEHOLD! I am the DataBase Dragon, master of all SQL concepts! To escape the SQL Jungle, you must demonstrate your mastery of everything you've learned!",
    challenge: "Solve a complex database challenge that requires multiple SQL skills!",
    task: "Choose the most efficient and correct SQL solution to the following problem: Create a report showing the top 3 explorers by level, including their name, level, and total items collected, but only for explorers who joined before 2023.",
    skill: "SQL Mastery",
    defeatMessage: "INCREDIBLE! You have truly mastered SQL and defeated me, the mighty DataBase Dragon! The path out of the SQL Jungle is now open to you!",
    challengeType: "option",
    options: [
      "SELECT e.name, e.level, COUNT(ei.item_id) AS items_collected FROM explorers e LEFT JOIN explorer_items ei ON e.id = ei.explorer_id WHERE e.join_date < '2023-01-01' GROUP BY e.id, e.name, e.level ORDER BY e.level DESC LIMIT 3;",
      "SELECT name, level, items_collected FROM (SELECT * FROM explorers WHERE join_date < '2023-01-01') ORDER BY level DESC LIMIT 3;",
      "SELECT TOP 3 explorers.name, explorers.level, COUNT(*) FROM explorers, explorer_items WHERE join_date < '2023-01-01' GROUP BY explorers.name ORDER BY explorers.level;",
      "SELECT e.name, e.level, i.total FROM explorers e, (SELECT explorer_id, COUNT(*) AS total FROM explorer_items GROUP BY explorer_id) i WHERE e.id = i.explorer_id AND e.join_date < '2023-01-01' LIMIT 3;"
    ],
    correctOption: "SELECT e.name, e.level, COUNT(ei.item_id) AS items_collected FROM explorers e LEFT JOIN explorer_items ei ON e.id = ei.explorer_id WHERE e.join_date < '2023-01-01' GROUP BY e.id, e.name, e.level ORDER BY e.level DESC LIMIT 3;"
  }
]; 