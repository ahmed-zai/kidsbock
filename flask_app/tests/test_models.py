# flask_app/tests/test_models.py
import pytest
from unittest.mock import MagicMock, patch
from models import save_child_insight, get_db_connection
from config import Config

# Mock Config.DATABASE_URL
# @patch is a decorator that temporarily replaces objects with mocks
# We need to mock Config.DATABASE_URL because get_db_connection uses it.
@patch('config.Config.DATABASE_URL', 'postgresql://test:test@test_db:5432/test_db')
def test_get_db_connection():
    # Mock psycopg2.connect
    with patch('psycopg2.connect') as mock_connect:
        get_db_connection()
        mock_connect.assert_called_once_with('postgresql://test:test@test_db:5432/test_db')

@patch('models.get_db_connection')
def test_save_child_insight(mock_get_db_connection):
    # Setup mocks for connection and cursor
    mock_conn = MagicMock()
    mock_cur = MagicMock()
    mock_get_db_connection.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cur

    # Mock fetchone to return an ID
    mock_cur.fetchone.return_value = (1,)

    child_id = 1
    insight_type = 'reading_comprehension'
    score = 85.5
    summary = 'Understood main points well.'

    result_id = save_child_insight(child_id, insight_type, score, summary)

    # Assertions
    mock_get_db_connection.assert_called_once()
    mock_conn.cursor.assert_called_once()
    mock_cur.execute.assert_called_once_with(
        """
        INSERT INTO child_insights (child_id, insight_type, score, summary)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """,
        (child_id, insight_type, score, summary)
    )
    mock_conn.commit.assert_called_once()
    mock_cur.close.assert_called_once()
    mock_conn.close.assert_called_once()
    assert result_id == 1