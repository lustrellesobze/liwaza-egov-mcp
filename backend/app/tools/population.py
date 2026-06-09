import httpx
from app.config import settings

async def get_population_data(years: int = 5) -> dict:
    url = (
        f"{settings.WORLDBANK_BASE_URL}/country/{settings.COUNTRY_CODE}"
        f"/indicator/SP.POP.TOTL?format=json&per_page={years}&mrv={years}"
    )
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    records = data[1] if len(data) > 1 else []
    return {
        "indicator": "Total Population",
        "country": "Cameroon",
        "data": [
            {
                "year": r["date"],
                "value": r["value"],
                "formatted": f"{r['value']/1e6:.2f}M habitants" if r["value"] else "N/A"
            }
            for r in records if r["value"]
        ]
    }
