from __future__ import annotations

import contextlib
import io
import json
from pathlib import Path
from types import SimpleNamespace


ROOT_DIR = Path(__file__).resolve().parents[3]
NOTEBOOK_PATH = ROOT_DIR / "Untitled37.ipynb"


def load_notebook_model() -> SimpleNamespace:
    """Load notebook definitions without executing its main workflow."""
    notebook = json.loads(NOTEBOOK_PATH.read_text(encoding="utf-8"))
    code_parts: list[str] = []

    for cell in notebook.get("cells", []):
        if cell.get("cell_type") != "code":
            continue
        source = "".join(cell.get("source", []))
        marker = "# MAIN EXECUTION"
        if marker in source:
            source = source.split(marker, 1)[0]
        code_parts.append(source)

    namespace: dict[str, object] = {"__name__": "notebook_model_runtime"}
    with contextlib.redirect_stdout(io.StringIO()):
        exec("\n\n".join(code_parts), namespace)
    return SimpleNamespace(**namespace)
