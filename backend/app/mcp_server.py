import json
import logging
from app.tools.gdp import get_gdp_data
from app.tools.population import get_population_data
from app.tools.inflation import get_inflation_data
from app.tools.employment import get_unemployment_data
from app.tools.country_info import get_country_info

logger = logging.getLogger(__name__)

# Définition des 5 outils MCP exposés
MCP_TOOLS = [
    {
        "name": "get_gdp_data",
        "description": "Retrieves GDP data for Cameroon from World Bank. Use when user asks about economic growth, PIB, GDP, economic performance.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "years": {"type": "integer", "description": "Number of recent years", "default": 5}
            }
        }
    },
    {
        "name": "get_population_data", 
        "description": "Retrieves population statistics for Cameroon. Use when user asks about demographics, population, habitants.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "years": {"type": "integer", "description": "Number of recent years", "default": 5}
            }
        }
    },
    {
        "name": "get_inflation_data",
        "description": "Retrieves inflation rate data for Cameroon. Use when user asks about inflation, prices, cost of living, taux d'inflation.",
        "inputSchema": {
            "type": "object", 
            "properties": {
                "years": {"type": "integer", "description": "Number of recent years", "default": 5}
            }
        }
    },
    {
        "name": "get_unemployment_data",
        "description": "Retrieves unemployment statistics for Cameroon. Use when user asks about chômage, unemployment, emploi, travail.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "years": {"type": "integer", "description": "Number of recent years", "default": 5}
            }
        }
    },
    {
        "name": "get_country_info",
        "description": "Retrieves general information about Cameroon: capital, region, income level. Use for general country questions.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    }
]

async def execute_tool(tool_name: str, tool_input: dict) -> dict:
    """Exécute un outil MCP et retourne le résultat"""
    logger.info(f"Executing MCP tool: {tool_name} with input: {tool_input}")
    
    try:
        if tool_name == "get_gdp_data":
            return await get_gdp_data(tool_input.get("years", 5))
        elif tool_name == "get_population_data":
            return await get_population_data(tool_input.get("years", 5))
        elif tool_name == "get_inflation_data":
            return await get_inflation_data(tool_input.get("years", 5))
        elif tool_name == "get_unemployment_data":
            return await get_unemployment_data(tool_input.get("years", 5))
        elif tool_name == "get_country_info":
            return await get_country_info()
        else:
            raise ValueError(f"Unknown tool: {tool_name}")
    except Exception as e:
        logger.error(f"Tool execution error: {e}")
        raise