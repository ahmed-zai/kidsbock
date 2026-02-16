import pytest
from flask_app.ai_engine import analyze_reading_session

def test_analyze_reading_session_normal_data():
    session_data = {
        'child_id': 'child_abc',
        'book_id': 'book_123',
        'page_events': [
            {'page_number': 1, 'time_spent_seconds': 30},
            {'page_number': 2, 'time_spent_seconds': 45},
            {'page_number': 3, 'time_spent_seconds': 25},
        ],
        'audio_events': [
            {'page_number': 1, 'action': 'play'},
            {'page_number': 2, 'action': 'replay'},
            {'page_number': 2, 'action': 'play'},
            {'page_number': 3, 'action': 'play'},
        ],
        'total_minutes': 10
    }

    insights = analyze_reading_session(session_data)

    assert len(insights) == 2

    attention_span_insight = next(item for item in insights if item['insight_type'] == 'attention_span')
    assert attention_span_insight['score'] == round((30 + 45 + 25) / 3, 2)
    assert 'Average attention per page: 33.33 seconds' in attention_span_insight['summary']

    difficulty_area_insight = next(item for item in insights if item['insight_type'] == 'difficulty_area')
    assert difficulty_area_insight['score'] == 10
    assert 'Child replayed audio 1 times, possible difficulty' in difficulty_area_insight['summary']

def test_analyze_reading_session_empty_page_events():
    session_data = {
        'child_id': 'child_abc',
        'book_id': 'book_123',
        'page_events': [],
        'audio_events': [
            {'page_number': 1, 'action': 'replay'},
        ],
        'total_minutes': 5
    }

    insights = analyze_reading_session(session_data)

    attention_span_insight = next(item for item in insights if item['insight_type'] == 'attention_span')
    assert attention_span_insight['score'] == 0.0 # (0/1) = 0
    assert 'Average attention per page: 0.0 seconds' in attention_span_insight['summary']

def test_analyze_reading_session_empty_audio_events():
    session_data = {
        'child_id': 'child_abc',
        'book_id': 'book_123',
        'page_events': [
            {'page_number': 1, 'time_spent_seconds': 30},
        ],
        'audio_events': [],
        'total_minutes': 5
    }

    insights = analyze_reading_session(session_data)

    difficulty_area_insight = next(item for item in insights if item['insight_type'] == 'difficulty_area')
    assert difficulty_area_insight['score'] == 0
    assert 'Child replayed audio 0 times, possible difficulty' in difficulty_area_insight['summary']

def test_analyze_reading_session_max_attention_span():
    session_data = {
        'child_id': 'child_abc',
        'book_id': 'book_123',
        'page_events': [
            {'page_number': 1, 'time_spent_seconds': 100},
            {'page_number': 2, 'time_spent_seconds': 100},
        ],
        'audio_events': [],
        'total_minutes': 5
    }

    insights = analyze_reading_session(session_data)

    attention_span_insight = next(item for item in insights if item['insight_type'] == 'attention_span')
    assert attention_span_insight['score'] == 60.0 # Should be capped at 60
    assert 'Average attention per page: 60 seconds' in attention_span_insight['summary']

def test_analyze_reading_session_max_difficulty_score():
    session_data = {
        'child_id': 'child_abc',
        'book_id': 'book_123',
        'page_events': [],
        'audio_events': [
            {'page_number': 1, 'action': 'replay'},
            {'page_number': 2, 'action': 'replay'},
            {'page_number': 3, 'action': 'replay'},
            {'page_number': 4, 'action': 'replay'},
            {'page_number': 5, 'action': 'replay'},
            {'page_number': 6, 'action': 'replay'},
            {'page_number': 7, 'action': 'replay'},
            {'page_number': 8, 'action': 'replay'},
            {'page_number': 9, 'action': 'replay'},
            {'page_number': 10, 'action': 'replay'},
            {'page_number': 11, 'action': 'replay'}, # 11 replays would be 110, capped at 100
        ],
        'total_minutes': 5
    }

    insights = analyze_reading_session(session_data)

    difficulty_area_insight = next(item for item in insights if item['insight_type'] == 'difficulty_area')
    assert difficulty_area_insight['score'] == 100 # Should be capped at 100
    assert 'Child replayed audio 11 times, possible difficulty' in difficulty_area_insight['summary']
