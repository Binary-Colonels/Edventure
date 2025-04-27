-- Add has_podcast column to notes table
ALTER TABLE notes ADD COLUMN has_podcast INTEGER DEFAULT 0; 