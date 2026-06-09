import httpx
from app.config import settings

async def get_gdp_data(years: int = 5) -> dict:
    """Récupère les données PIB du Cameroun depuis World Bank API"""
    url = (
        f"{settings.WORLDBANK_BASE_URL}/country/{settings.COUNTRY_CODE}"
        f"/indicator/NY.GDP.MKTP.CD?format=json&per_page={years}&mrv={years}"
    )
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    records = data[1] if len(data) > 1 else []
    return {
        "indicator": "GDP (current US$)",
        "country": "Cameroon",
        "data": [
            {
                "year": r["date"],
                "value_usd": r["value"],
                "formatted": f"${r['value']/1e9:.2f}B" if r["value"] else "N/A"
            }
            for r in records if r["value"]
        ]
    }
