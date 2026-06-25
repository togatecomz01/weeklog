CREATE TABLE IF NOT EXISTS drafts (
  id         SERIAL PRIMARY KEY,
  user_id    INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  write_date DATE,
  title      VARCHAR(255) NOT NULL DEFAULT '',
  priority   VARCHAR(20)  NOT NULL DEFAULT '보통',
  completed_work  TEXT NOT NULL DEFAULT '',
  ongoing_work    TEXT NOT NULL DEFAULT '',
  next_week_plan  TEXT NOT NULL DEFAULT '',
  notes           TEXT NOT NULL DEFAULT '',
  saved_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);
