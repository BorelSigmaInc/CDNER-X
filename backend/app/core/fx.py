"""Location-based currency, always quoted equivalent to USD."""
from __future__ import annotations

from typing import Optional
import json
import urllib.request

# Fallback mid-market rates vs 1 USD (used when live FX is unavailable).
FALLBACK_RATES = {
    "USD": 1.0,
    "EUR": 0.86,
    "GBP": 0.74,
    "CAD": 1.36,
    "AUD": 1.52,
    "CHF": 0.80,
    "JPY": 147.0,
    "INR": 83.5,
    "NGN": 1600.0,
    "KES": 129.0,
    "GHS": 12.1,
    "ZAR": 18.2,
    "AED": 3.6725,
    "CNY": 7.18,
}

COUNTRY_CURRENCY = {
    "US": "USD", "GB": "GBP", "UK": "GBP",
    "DE": "EUR", "FR": "EUR", "NL": "EUR", "IE": "EUR", "ES": "EUR",
    "IT": "EUR", "PT": "EUR", "BE": "EUR", "AT": "EUR", "FI": "EUR",
    "CA": "CAD", "AU": "AUD", "CH": "CHF", "JP": "JPY", "IN": "INR",
    "NG": "NGN", "KE": "KES", "GH": "GHS", "ZA": "ZAR", "AE": "AED",
    "CN": "CNY", "NZ": "AUD",
}

TZ_CURRENCY = {
    "America/New_York": "USD", "America/Chicago": "USD", "America/Los_Angeles": "USD",
    "America/Toronto": "CAD", "America/Vancouver": "CAD",
    "Europe/London": "GBP", "Europe/Dublin": "EUR",
    "Europe/Berlin": "EUR", "Europe/Paris": "EUR", "Europe/Amsterdam": "EUR",
    "Africa/Lagos": "NGN", "Africa/Accra": "GHS", "Africa/Nairobi": "KES",
    "Africa/Johannesburg": "ZAR",
    "Asia/Kolkata": "INR", "Asia/Dubai": "AED", "Asia/Tokyo": "JPY",
    "Australia/Sydney": "AUD", "Australia/Melbourne": "AUD",
}

SYMBOLS = {
    "USD": "$", "EUR": "€", "GBP": "£", "CAD": "CA$", "AUD": "A$",
    "CHF": "CHF ", "JPY": "¥", "INR": "₹", "NGN": "₦", "KES": "KSh ",
    "GHS": "GH₵", "ZAR": "R", "AED": "AED ", "CNY": "¥",
}

_live_cache: dict[str, float] | None = None


def live_rates() -> dict[str, float]:
    global _live_cache
    if _live_cache is not None:
        return _live_cache
    try:
        req = urllib.request.Request(
            "https://api.frankfurter.app/latest?from=USD",
            headers={"User-Agent": "cdner-x/2"},
        )
        with urllib.request.urlopen(req, timeout=2.5) as resp:
            payload = json.loads(resp.read().decode())
        rates = {"USD": 1.0}
        rates.update(payload.get("rates") or {})
        _live_cache = {k: float(v) for k, v in rates.items() if k in FALLBACK_RATES or k == "USD"}
        return _live_cache
    except Exception:
        _live_cache = dict(FALLBACK_RATES)
        return _live_cache


def detect_currency(
    explicit: Optional[str] = None,
    country: Optional[str] = None,
    language: Optional[str] = None,
    tz: Optional[str] = None,
) -> str:
    if explicit:
        code = explicit.upper()
        if code in FALLBACK_RATES:
            return code
    if country:
        mapped = COUNTRY_CURRENCY.get(country.upper())
        if mapped:
            return mapped
    if tz and tz in TZ_CURRENCY:
        return TZ_CURRENCY[tz]
    if language:
        parts = language.split(",")[0].strip().replace("_", "-").split("-")
        if len(parts) >= 2:
            mapped = COUNTRY_CURRENCY.get(parts[1].upper())
            if mapped:
                return mapped
        if parts[0].lower() == "en":
            return "USD"
    return "USD"


def convert(usd: float, currency: str) -> dict:
    currency = (currency or "USD").upper()
    rates = live_rates()
    rate = float(rates.get(currency, FALLBACK_RATES.get(currency, 1.0)))
    local = round(usd * rate, 2 if currency not in ("JPY", "NGN") else 0)
    return {
        "usd": round(usd, 2),
        "amount": local,
        "currency": currency,
        "rate": rate,
        "symbol": SYMBOLS.get(currency, f"{currency} "),
        "label": f"{SYMBOLS.get(currency, '')}{local:,.0f}" if currency in ("JPY", "NGN") else f"{SYMBOLS.get(currency, '')}{local:,.2f}",
    }
