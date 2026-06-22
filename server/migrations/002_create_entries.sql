CREATE TABLE IF NOT EXISTS entries (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_year      SMALLINT NOT NULL,
  week_month     SMALLINT NOT NULL CHECK (week_month  BETWEEN 1 AND 12),
  week_number    SMALLINT NOT NULL CHECK (week_number BETWEEN 1 AND 6),
  priority       VARCHAR(10) NOT NULL CHECK (priority IN ('보통', '중요', '긴급')),
  department     VARCHAR(100) NOT NULL,
  title          VARCHAR(255) NOT NULL,
  completed_work TEXT NOT NULL DEFAULT '',
  ongoing_work   TEXT NOT NULL DEFAULT '',
  next_week_plan TEXT NOT NULL DEFAULT '',
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, week_year, week_month, week_number)
);
