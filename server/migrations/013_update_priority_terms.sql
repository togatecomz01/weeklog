ALTER TABLE entries DROP CONSTRAINT entries_priority_check;

UPDATE entries SET priority = '높음' WHERE priority = '중요';
UPDATE entries SET priority = '매우 높음' WHERE priority = '긴급';

ALTER TABLE entries ADD CONSTRAINT entries_priority_check CHECK (priority IN ('보통', '높음', '매우 높음'));
