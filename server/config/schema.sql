CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'parent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    avatar_url TEXT,
    reading_level VARCHAR(50) DEFAULT 'beginner',
    data_consent BOOLEAN DEFAULT FALSE, -- Added data_consent column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_children_user_id ON children(user_id);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    age_min INT CHECK (age_min >= 0),
    age_max INT CHECK (age_max >= age_min)
);

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    content_url TEXT NOT NULL,
    audio_url TEXT,
    reading_level VARCHAR(50),
    age_min INT CHECK (age_min >= 0),
    age_max INT CHECK (age_max >= age_min),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_reading_level ON books(reading_level);
CREATE INDEX idx_books_age_range ON books(age_min, age_max);
CREATE INDEX idx_books_published ON books(is_published);

CREATE TABLE book_categories (
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

CREATE TABLE book_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    text_content TEXT,
    image_url TEXT,
    audio_url TEXT,
    UNIQUE (book_id, page_number)
);

CREATE INDEX idx_pages_book_id ON book_pages(book_id);

CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    last_page_read INT DEFAULT 0,
    progress_percent INT CHECK (progress_percent BETWEEN 0 AND 100),
    completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (child_id, book_id)
);

CREATE INDEX idx_progress_child ON reading_progress(child_id);
CREATE INDEX idx_progress_book ON reading_progress(book_id);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon_url TEXT
);

CREATE TABLE child_achievements (
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (child_id, achievement_id)
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_books_updated
BEFORE UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL, -- monthly, yearly
    status VARCHAR(50) NOT NULL, -- active, canceled, expired
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- USERS
ALTER TABLE users ADD COLUMN plan_type VARCHAR(20) NOT NULL DEFAULT 'free';

-- SUBSCRIPTIONS
ALTER TABLE subscriptions ADD CONSTRAINT chk_status CHECK (status IN ('active','canceled','expired'));
CREATE UNIQUE INDEX one_active_subscription_per_user ON subscriptions(user_id) WHERE status = 'active';

-- BOOKS
ALTER TABLE books ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;

-- ACHIEVEMENTS
ALTER TABLE achievements ADD COLUMN is_premium BOOLEAN DEFAULT TRUE;

CREATE TABLE reading_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    total_minutes INT,
    device_type VARCHAR(50), -- tablet, mobile, desktop
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_child ON reading_sessions(child_id);
CREATE INDEX idx_sessions_book ON reading_sessions(book_id);

CREATE TABLE page_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
    page_number INT,
    event_type VARCHAR(50), -- open, next, previous, replay_audio
    time_spent_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_events_session ON page_events(session_id);

CREATE TABLE audio_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
    page_number INT,
    action VARCHAR(50), -- play, pause, replay
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE child_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    insight_type VARCHAR(100), -- attention_span, difficulty_area
    score NUMERIC(5,2),
    summary TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);