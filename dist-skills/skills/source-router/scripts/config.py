import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

DEFAULT_PROVIDERS: List[str] = [
    "github",
    "github_issues",
    "github_code",
    "github_discussions",
    "tavily",
    "exa",
    "brave",
    "metaso",
    "serpapi",
    "serper",
    "bing",
    "google_cse",
    "firecrawl",
    "tikhub",
]

API_ENV_MAP: Dict[str, List[str]] = {
    "github": [],
    "github_issues": [],
    "github_code": [],
    "github_discussions": [],
    "tavily": ["TAVILY_API_KEY"],
    "exa": ["EXA_API_KEY"],
    "brave": ["BRAVE_SEARCH_API_KEY"],
    "metaso": [],
    "serpapi": ["SERPAPI_API_KEY"],
    "serper": ["SERPER_API_KEY"],
    "bing": ["BING_SEARCH_API_KEY"],
    "google_cse": ["GOOGLE_CSE_API_KEY", "GOOGLE_CSE_ENGINE_ID"],
    "firecrawl": [],
    "tikhub": ["TIKHUB_API_KEY"],
    "tikhub_reddit": ["TIKHUB_API_KEY"],
    "tikhub_x": ["TIKHUB_API_KEY"],
    "tikhub_youtube": ["TIKHUB_API_KEY"],
    "browser": [],
    "browser_use": [],
}

OPTIONAL_ENV_MAP: Dict[str, List[str]] = {
    "github": ["GITHUB_TOKEN"],
    "github_issues": ["GITHUB_TOKEN"],
    "github_code": ["GITHUB_TOKEN"],
    "github_discussions": ["GITHUB_TOKEN"],
    "metaso": ["METASO_API_KEY"],
    "firecrawl": ["FIRECRAWL_API_KEY"],
    "browser": ["BROWSER_USE_PROFILE"],
    "browser_use": ["BROWSER_USE_PROFILE"],
}


ENV_LOADED = False


def load_dotenv(path: str = "") -> List[str]:
    """Load simple KEY=VALUE pairs from .env files without external dependencies.

    Precedence: existing environment variables win; .env only fills missing keys.
    Search order when path is empty:
    - current working directory .env
    - skill root .env
    - skill root .env.local
    """
    global ENV_LOADED
    loaded: List[str] = []
    candidates: List[Path]
    if path:
        candidates = [Path(path)]
    else:
        skill_root = Path(__file__).resolve().parents[1]
        candidates = [Path.cwd() / ".env", skill_root / ".env", skill_root / ".env.local"]
    for candidate in candidates:
        if not candidate.exists() or not candidate.is_file():
            continue
        for raw_line in candidate.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value
                loaded.append(key)
    ENV_LOADED = True
    return loaded


def ensure_env_loaded() -> None:
    if not ENV_LOADED:
        load_dotenv()


@dataclass
class SearchConfig:
    providers: List[str]
    timeout_seconds: int = 20
    max_results: int = 8
    language: str = "zh-CN"
    country: str = "CN"


PROVIDER_MODES: Dict[str, Dict[str, object]] = {
    "fast": {
        "max_providers": 1,
        "max_results": 5,
        "extract_top": 0,
        "description": "最快：只用当前场景下第一个可用 provider，适合轻量问答。",
    },
    "balanced": {
        "max_providers": 3,
        "max_results": 8,
        "extract_top": 0,
        "description": "默认：2-3 个可用 provider 交叉验证，兼顾速度和准确性。",
    },
    "deep": {
        "max_providers": 8,
        "max_results": 15,
        "extract_top": 3,
        "description": "深度：尽量多源检索，并对前几个结果抽正文。",
    },
    "social": {
        "max_providers": 4,
        "max_results": 10,
        "extract_top": 0,
        "description": "社媒：优先 TikHub / X / Reddit / 视频平台，不乱打普通搜索。",
    },
    "technical": {
        "max_providers": 5,
        "max_results": 10,
        "extract_top": 1,
        "description": "技术：优先 GitHub / issues / code / Reddit，再补 Web。",
    },
}


BUDGETS: Dict[str, Dict[str, object]] = {
    "low": {"max_results_delta": -3, "extract_top_delta": -1, "crawl_limit": 5, "crawl_depth": 1, "allow_browser": False},
    "medium": {"max_results_delta": 0, "extract_top_delta": 0, "crawl_limit": 20, "crawl_depth": 1, "allow_browser": False},
    "high": {"max_results_delta": 7, "extract_top_delta": 2, "crawl_limit": 50, "crawl_depth": 2, "allow_browser": True},
}

TASK_DEFAULT_MODES: Dict[str, str] = {
    "repo_lookup": "technical",
    "technical_howto": "technical",
    "tool_selection": "technical",
    "username_content": "social",
    "creator_capture": "social",
    "social_tactic": "social",
    "url_extract": "fast",
    "site_crawl": "balanced",
    "entity_context": "balanced",
    "trend_signal": "balanced",
    "concept_explainer": "balanced",
    "simple_search": "balanced",
    "video_search": "social",
}


def get_provider_mode(mode: str) -> Dict[str, object]:
    ensure_env_loaded()
    selected = mode or os.getenv("SOURCE_ROUTER_MODE", "balanced")
    return PROVIDER_MODES.get(selected, PROVIDER_MODES["balanced"])


def infer_default_mode(task_type: str, explicit_mode: str = "") -> str:
    ensure_env_loaded()
    if explicit_mode:
        return explicit_mode
    env_mode = os.getenv("SOURCE_ROUTER_MODE", "")
    if env_mode:
        return env_mode
    return TASK_DEFAULT_MODES.get(task_type, "balanced")


def get_budget(budget: str) -> Dict[str, object]:
    ensure_env_loaded()
    selected = budget or os.getenv("SOURCE_ROUTER_BUDGET", "medium")
    return BUDGETS.get(selected, BUDGETS["medium"])


def env_safety_report() -> Dict[str, object]:
    skill_root = Path(__file__).resolve().parents[1]
    candidates = [Path.cwd() / ".env", skill_root / ".env", skill_root / ".env.local"]
    existing = [str(path) for path in candidates if path.exists()]
    gitignore = Path.cwd() / ".gitignore"
    gitignore_text = gitignore.read_text(encoding="utf-8") if gitignore.exists() else ""
    protected_patterns = [".env", "*.env", ".env.local", "skills/source-router/.env", "skills/source-router/.env.local"]
    matched_patterns = [pattern for pattern in protected_patterns if pattern in gitignore_text]
    warnings: List[str] = []
    if existing and not matched_patterns:
        warnings.append("Found .env files but .gitignore does not appear to contain .env protection patterns.")
    return {
        "env_files_found": existing,
        "gitignore_found": gitignore.exists(),
        "matched_gitignore_patterns": matched_patterns,
        "warnings": warnings,
    }


def get_default_config() -> SearchConfig:
    ensure_env_loaded()
    return SearchConfig(
        providers=DEFAULT_PROVIDERS.copy(),
        timeout_seconds=int(os.getenv("SOURCE_ROUTER_TIMEOUT", "20")),
        max_results=int(os.getenv("SOURCE_ROUTER_MAX_RESULTS", "8")),
        language=os.getenv("SOURCE_ROUTER_LANGUAGE", "zh-CN"),
        country=os.getenv("SOURCE_ROUTER_COUNTRY", "CN"),
    )


def get_enabled_provider_keys(provider: str) -> List[str]:
    return API_ENV_MAP.get(provider, [])


def get_optional_provider_keys(provider: str) -> List[str]:
    return OPTIONAL_ENV_MAP.get(provider, [])


def has_provider_credentials(provider: str) -> bool:
    ensure_env_loaded()
    keys = get_enabled_provider_keys(provider)
    if not keys:
        return True
    return all(bool(os.getenv(k)) for k in keys)
