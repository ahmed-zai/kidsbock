from flask import Blueprint, request, jsonify
from ai_engine import analyze_reading_session
from models import save_child_insight

bp = Blueprint('ai', __name__)

@bp.route('/analyze', methods=['POST'])
def analyze_session():
    try:
        data = request.json
        child_id = data['child_id']
        session_data = data  # page_events, audio_events, total_minutes

        # Analyze using AI engine
        insights = analyze_reading_session(session_data)

        # Save insights to DB
        results = []
        for insight in insights:
            insight_id = save_child_insight(child_id, insight['insight_type'], insight['score'], insight['summary'])
            insight['id'] = insight_id
            results.append(insight)

        return jsonify({'status': 'success', 'insights': results}), 201
    except Exception as e:
        print('Error analyzing session:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
