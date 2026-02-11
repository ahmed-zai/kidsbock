# Simulated AI logic for demo purposes
# You can replace with real ML/NLP model

def analyze_reading_session(session_data):
    """
    session_data: {
        'child_id': uuid,
        'book_id': uuid,
        'page_events': [...],
        'audio_events': [...],
        'total_minutes': int
    }
    """
    insights = []

    # Example: attention span
    time_spent = sum(event['time_spent_seconds'] for event in session_data['page_events'])
    avg_attention = min(time_spent / max(len(session_data['page_events']), 1), 60)
    insights.append({
        'insight_type': 'attention_span',
        'score': round(avg_attention, 2),
        'summary': f'Average attention per page: {round(avg_attention,2)} seconds'
    })

    # Example: audio difficulty
    replay_count = sum(1 for e in session_data['audio_events'] if e['action'] == 'replay')
    difficulty_score = min(replay_count * 10, 100)
    insights.append({
        'insight_type': 'difficulty_area',
        'score': difficulty_score,
        'summary': f'Child replayed audio {replay_count} times, possible difficulty'
    })

    return insights
