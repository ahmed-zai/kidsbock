import pytest
from unittest.mock import patch
from flask_app.app import app # Import the Flask app instance

# Fixture to provide a test client
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Test /health endpoint
def test_health_endpoint(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {'status': 'OK', 'message': 'AI service running'}

# Test /api/ai/analyze endpoint
@patch('flask_app.routes.save_child_insight')
@patch('flask_app.routes.analyze_reading_session')
def test_analyze_session_success(mock_analyze_reading_session, mock_save_child_insight, client):
    # Mock return values for the patched functions
    mock_analyze_reading_session.return_value = [
        {'insight_type': 'comprehension', 'score': 0.8, 'summary': 'Good comprehension'},
        {'insight_type': 'fluency', 'score': 0.7, 'summary': 'Average fluency'}
    ]
    mock_save_child_insight.side_effect = ['insight_id_1', 'insight_id_2']

    # Sample session data
    session_data = {
        'child_id': 'child123',
        'page_events': [],
        'audio_events': [],
        'total_minutes': 10
    }

    response = client.post('/api/ai/analyze', json=session_data)

    assert response.status_code == 201
    assert response.json['status'] == 'success'
    assert len(response.json['insights']) == 2
    assert response.json['insights'][0]['id'] == 'insight_id_1'
    assert response.json['insights'][1]['id'] == 'insight_id_2'

    mock_analyze_reading_session.assert_called_once_with(session_data)
    mock_save_child_insight.assert_any_call('child123', 'comprehension', 0.8, 'Good comprehension')
    mock_save_child_insight.assert_any_call('child123', 'fluency', 0.7, 'Average fluency')

@patch('flask_app.routes.analyze_reading_session')
def test_analyze_session_invalid_input(mock_analyze_reading_session, client):
    # Missing child_id in session_data will raise KeyError
    session_data = {
        'page_events': [],
        'audio_events': [],
        'total_minutes': 10
    }

    response = client.post('/api/ai/analyze', json=session_data)

    assert response.status_code == 500 # Expecting 500 due to KeyError
    assert response.json['status'] == 'error'
    assert 'message' in response.json
    mock_analyze_reading_session.assert_not_called()

@patch('flask_app.routes.save_child_insight')
@patch('flask_app.routes.analyze_reading_session')
def test_analyze_session_ai_failure(mock_analyze_reading_session, mock_save_child_insight, client):
    mock_analyze_reading_session.side_effect = Exception('AI processing failed')

    session_data = {
        'child_id': 'child123',
        'page_events': [],
        'audio_events': [],
        'total_minutes': 10
    }

    response = client.post('/api/ai/analyze', json=session_data)

    assert response.status_code == 500
    assert response.json['status'] == 'error'
    assert response.json['message'] == 'AI processing failed'
    mock_analyze_reading_session.assert_called_once_with(session_data)
    mock_save_child_insight.assert_not_called()

@patch('flask_app.routes.save_child_insight')
@patch('flask_app.routes.analyze_reading_session')
def test_analyze_session_db_failure(mock_analyze_reading_session, mock_save_child_insight, client):
    mock_analyze_reading_session.return_value = [
        {'insight_type': 'comprehension', 'score': 0.8, 'summary': 'Good comprehension'}
    ]
    mock_save_child_insight.side_effect = Exception('Database save failed')

    session_data = {
        'child_id': 'child123',
        'page_events': [],
        'audio_events': [],
        'total_minutes': 10
    }

    response = client.post('/api/ai/analyze', json=session_data)

    assert response.status_code == 500
    assert response.json['status'] == 'error'
    assert response.json['message'] == 'Database save failed'
    mock_analyze_reading_session.assert_called_once_with(session_data)
    mock_save_child_insight.assert_called_once_with('child123', 'comprehension', 0.8, 'Good comprehension')
