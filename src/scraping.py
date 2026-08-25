"""
Web Scraping Module
Uses Requests and BeautifulSoup4 to extract tabular data from webpages.
Includes fallback sample data to ensure reliability offline.
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd


def scrape_table_data(url: str = "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population") -> tuple[pd.DataFrame, str]:
    """
    Scrapes the first table found at `url` using Requests and BeautifulSoup4.
    If internet connectivity fails or URL is invalid, returns fallback tabular data gracefully.
    """
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) StudentPerformanceApp/1.0'}
    
    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        tables = soup.find_all('table', {'class': ['wikitable', 'dataframe', 'table']})
        
        if not tables:
            tables = soup.find_all('table')
            
        if not tables:
            return _get_fallback_scraped_data(), "No HTML tables found on target webpage. Used fallback data."
            
        target_table = tables[0]
        rows = target_table.find_all('tr')
        
        table_data = []
        headers_list = []
        
        for i, row in enumerate(rows):
            cols = row.find_all(['th', 'td'])
            cols_text = [c.text.strip() for c in cols]
            
            if i == 0 and not headers_list:
                headers_list = cols_text
            else:
                if cols_text:
                    table_data.append(cols_text)
                    
        if table_data:
            if headers_list and len(headers_list) == len(table_data[0]):
                df = pd.DataFrame(table_data, columns=headers_list)
            else:
                df = pd.DataFrame(table_data)
            return df.head(50), f"Successfully scraped {len(df)} rows from {url}!"
        else:
            return _get_fallback_scraped_data(), "Table parsing returned empty content. Used fallback dataset."

    except Exception as e:
        return _get_fallback_scraped_data(), f"Scraping Notice ({type(e).__name__}): {str(e)}. Displaying fallback scraped dataset."


def _get_fallback_scraped_data() -> pd.DataFrame:
    """
    Provides fallback tabular dataset for offline testing and demonstration.
    """
    fallback_data = {
        'Rank': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'Country': ['India', 'China', 'United States', 'Indonesia', 'Pakistan', 'Nigeria', 'Brazil', 'Bangladesh', 'Russia', 'Mexico'],
        'Population_Estimate': [1428627663, 1425671352, 339996563, 277534122, 240485658, 223804632, 215313498, 172954319, 144444359, 128455567],
        'Percentage_World': ['17.8%', '17.7%', '4.2%', '3.5%', '3.0%', '2.8%', '2.7%', '2.2%', '1.8%', '1.6%']
    }
    return pd.DataFrame(fallback_data)
