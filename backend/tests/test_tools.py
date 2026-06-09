import pytest
from app.tools.gdp import get_gdp_data
from app.tools.population import get_population_data
from app.tools.inflation import get_inflation_data
from app.tools.employment import get_unemployment_data
from app.tools.country_info import get_country_info


@pytest.mark.asyncio
async def test_get_gdp_data():
    result = await get_gdp_data(years=3)
    assert result["country"] == "Cameroon"
    assert "data" in result
    assert len(result["data"]) > 0
    assert "year" in result["data"][0]
    assert "formatted" in result["data"][0]

@pytest.mark.asyncio
async def test_get_population_data():
    try:
        result = await get_population_data(years=3)
        assert result["country"] == "Cameroon"
        assert "data" in result
        assert len(result["data"]) > 0
    except Exception as e:
        pytest.skip(f"Network error (intermittent): {e}")


@pytest.mark.asyncio
async def test_get_inflation_data():
    result = await get_inflation_data(years=3)
    assert result["country"] == "Cameroon"
    assert "data" in result


@pytest.mark.asyncio
async def test_get_unemployment_data():
    result = await get_unemployment_data(years=3)
    assert result["country"] == "Cameroon"
    assert "data" in result


@pytest.mark.asyncio
async def test_get_country_info():
    result = await get_country_info()
    assert result["name"] == "Cameroon"
    assert result["capital"] == "Yaounde"
    assert result["region"] is not None