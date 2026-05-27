from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from uuid import uuid4


RESULTS_DIR = Path(__file__).resolve().parents[1] / "data" / "results"


def _safe_float(value, default=0.0):
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _report_path(report_id: str) -> Path:
    return RESULTS_DIR / f"{report_id}.json"


def _load_all_results():
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    for path in RESULTS_DIR.glob("*.json"):
        try:
            results.append(json.loads(path.read_text(encoding="utf-8")))
        except json.JSONDecodeError:
            continue
    return sorted(results, key=lambda item: item.get("timestamp", ""), reverse=True)


def save_result(payload: dict):
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    report_id = str(uuid4())
    record = {
        "report_id": report_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        **payload,
    }
    _report_path(report_id).write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"saved": True, "message": "Report saved successfully.", "report": record}


def get_saved_results():
    return {"results": _load_all_results()}


def get_dashboard_summary():
    results = _load_all_results()
    total = len(results)
    won = sum(1 for item in results if item.get("predicted_result") == "Won")
    lost = sum(1 for item in results if item.get("predicted_result") == "Lost")
    probabilities = [_safe_float(item.get("win_probability")) for item in results]
    prices = [_safe_float(item.get("selected_price", item.get("price"))) for item in results]
    expected_values = [_safe_float(item.get("expected_value")) for item in results]
    highest_expected = max(expected_values) if expected_values else 0
    high_risk_candidates = sorted(results, key=lambda item: _safe_float(item.get("win_probability")))
    highest_risk = high_risk_candidates[0] if high_risk_candidates else None

    return {
        "total_analyzed_offers": total,
        "average_win_probability": 0 if total == 0 else sum(probabilities) / total,
        "predicted_won_count": won,
        "predicted_lost_count": lost,
        "average_quoted_price": 0 if total == 0 else sum(prices) / total,
        "highest_expected_value": highest_expected,
        "highest_risk_offer": highest_risk,
    }
