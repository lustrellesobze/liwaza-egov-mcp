import httpx
from app.config import settings

async def get_country_info() -> dict:
    url = f"{settings.WORLDBANK_BASE_URL}/country/{settings.COUNTRY_CODE}?format=json"
    async with httpx.AsyncClient() as client:
        response = client.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    info = data[1][0] if len(data) > 1 and data[1] else {}
    return {
        "name": info.get("name"),
        "capital": info.get("capitalCity"),
        "region": info.get("region", {}).get("value"),
        "income_level": info.get("incomeLevel", {}).get("value"),
        "lending_type": info.get("lendingType", {}).get("value"),
        "longitude": info.get("longitude"),
        "latitude": info.get("latitude"),
    }