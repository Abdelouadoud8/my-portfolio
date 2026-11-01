-- Training bot tables (Frankfurt project "portfolio-automations", database neondb).
-- Applied by setup-db.mjs as the owner; the function logs in as the least-privilege role "training_bot".
CREATE SCHEMA IF NOT EXISTS training_bot;

-- One row per session (date) of a training. Synced from the website data by sync-sessions.mjs.
CREATE TABLE IF NOT EXISTS training_bot.sessions (
  id            text PRIMARY KEY,          -- "<trainingId>_<sessionId>", e.g. ai-essentials_2026-11-28 (the /start parameter)
  training_id   text NOT NULL,
  label         text NOT NULL,             -- "السبت 28 نوفمبر · 20:00 - 22:00"
  price         text NOT NULL,             -- "1500 DA"
  seats         integer NOT NULL,
  booking_open  boolean NOT NULL DEFAULT false,
  group_chat_id bigint,                    -- private Telegram group of this session (/setgroup)
  invite_link   text,                      -- join-request link of that group (created by the bot)
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- One row per person and session. status:
--   awaiting_name → awaiting_phone → awaiting_receipt (seat held until hold_expires_at)
--   → pending_review (receipt sent to the admin) → paid | rejected (can send a new receipt)
--   cancelled: the person stopped (/cancel)
CREATE TABLE IF NOT EXISTS training_bot.registrations (
  id              serial PRIMARY KEY,
  session_id      text NOT NULL REFERENCES training_bot.sessions(id),
  tg_user_id      bigint NOT NULL,
  tg_username     text,
  name            text,
  phone           text,
  status          text NOT NULL DEFAULT 'awaiting_name',
  hold_expires_at timestamptz,
  receipt_count   integer NOT NULL DEFAULT 0,
  admin_message_id bigint,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  approved_at     timestamptz,
  joined_at       timestamptz,
  UNIQUE (session_id, tg_user_id)
);

-- Seats sold outside the bot (before it existed, cash, ...): counted as taken
ALTER TABLE training_bot.sessions ADD COLUMN IF NOT EXISTS reserved_seats integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS registrations_user_idx ON training_bot.registrations (tg_user_id);
CREATE INDEX IF NOT EXISTS registrations_session_status_idx ON training_bot.registrations (session_id, status);
