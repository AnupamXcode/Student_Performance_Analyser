/**
 * Web Scraping Engine
 * Parses tabular HTML data from public URL or falls back to demo scraped data.
 */

export const fetchAndParseWebTable = async (url) => {
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const htmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const table = doc.querySelector('table.wikitable, table.dataframe, table');

    if (!table) return { dataset: getFallbackScrapedData(), message: 'No HTML tables found on target webpage. Showing sample dataset.' };

    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length === 0) return { dataset: getFallbackScrapedData(), message: 'Table rows empty. Showing sample dataset.' };

    const headers = Array.from(rows[0].querySelectorAll('th, td')).map(cell => cell.textContent.trim());
    const dataRows = [];

    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td, th')).map(cell => cell.textContent.trim());
      if (cells.length === 0) continue;
      const rowObj = {};
      cells.forEach((val, idx) => {
        const key = headers[idx] || `Col_${idx + 1}`;
        rowObj[key] = val;
      });
      dataRows.push(rowObj);
    }

    return {
      dataset: dataRows.slice(0, 50),
      message: `Successfully extracted ${dataRows.length} rows from ${url}!`
    };

  } catch (err) {
    return {
      dataset: getFallbackScrapedData(),
      message: `Scraping Notice (${err.message}): Displaying fallback scraped dataset.`
    };
  }
};

export const getFallbackScrapedData = () => [
  { Rank: 1, Country: 'India', Population: '1,428,627,663', WorldPercentage: '17.8%' },
  { Rank: 2, Country: 'China', Population: '1,425,671,352', WorldPercentage: '17.7%' },
  { Rank: 3, Country: 'United States', Population: '339,996,563', WorldPercentage: '4.2%' },
  { Rank: 4, Country: 'Indonesia', Population: '277,534,122', WorldPercentage: '3.5%' },
  { Rank: 5, Country: 'Pakistan', Population: '240,485,658', WorldPercentage: '3.0%' },
  { Rank: 6, Country: 'Nigeria', Population: '223,804,632', WorldPercentage: '2.8%' },
  { Rank: 7, Country: 'Brazil', Population: '215,313,498', WorldPercentage: '2.7%' },
  { Rank: 8, Country: 'Bangladesh', Population: '172,954,319', WorldPercentage: '2.2%' },
  { Rank: 9, Country: 'Russia', Population: '144,444,359', WorldPercentage: '1.8%' },
  { Rank: 10, Country: 'Mexico', Population: '128,455,567', WorldPercentage: '1.6%' }
];
