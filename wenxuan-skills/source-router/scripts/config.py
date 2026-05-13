import os
from dataclasses import dataclass
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
    "tikhub": [],
}

OPTIONAL_ENV_MAP: Dict[str, List[str]] = {
    "github": ["GITHUB_TOKEN"],
    "github_issues": ["GITHUB_TOKEN"],
    "github_code": ["GITHUB_TOKEN"],
    "github_discussions": ["GITHUB_TOKEN"],
    "metaso": ["METASO_API_KEY"],
    "firecrawl": ["FIRECRAWL_API_KEY"],
    "tikhub": ["TIKHUB_API_KEY"],
}


@dataclass
class SearchConfig:
    providers: List[str]
    timeout_seconds: int = 20
    max_results: int = 8
    language: str = "zh-CN"
    country: str = "CN"


def get_default_config() -> SearchConfig:
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
    keys = get_enabled_provider_keys(provider)
    if not keys:
        return True
    return all(bool(os.getenv(k)) for k in keys)
