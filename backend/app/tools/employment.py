import httpx
from app.config import settings

async def get_unemployment_data(years: int = 5) -> dict:
    url = (
        f"{settings.WORLDBANK_BASE_URL}/country/{settings.COUNTRY_CODE}"
        f"/indicator/SL.UEM.TOTL.ZS?format=json&per_page={years}&mrv={years}"
    )
    async with httpx.AsyncClient() as client:
        response = client.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    records = data[1] if len(data) > 1 else []
    return {
        "indicator": "Unemployment Rate (%)",
        "country": "Cameroon",
        "data": [
            {
                "year": r["date"],
                "rate_percent": round(r["value"], 2) if r["value"] else None,
                "formatted": f"{r['value']:.2f}%" if r["value"] else "N/A"
            }
            for r in records if r["value"]
        ]
    }