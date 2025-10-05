""" b_o_data.py -
Scrape Washington Business & Occupation tax data & wrangle it into a nice shape.
"""
import requests
from bs4 import BeautifulSoup

URL = (
    "https://apps.dor.wa.gov/ResearchStats/Content/QuarterlyBusinessReview/"
    "Results5.aspx?Period=2025Q1&Type=naics&Format=HTML"
)

# _get_data pulls given google doc link from the web and parses the HTML content into
# a nice dict for use
def _get_data(link):
    # Use the BeautifulSoup library to parse the HTML and pull out the table containing coords
    document = requests.get(link, timeout=10)
    html_content = BeautifulSoup(document.text, features="html.parser")
    tables = html_content.find_all("table")
    data = []

    # Iterate through the table and create a dictionary of the form dict[(x,y)] = character
    for table in tables:
        for row in table.find_all("tr"):
            cols = row.find_all("td")
            if "Naics" in cols[0].text:
                continue
            if "Total" in cols[0].text:
                continue
            cols = [c.text for c in cols]
            for c in cols:
                if c[0] == "$":
                    cols[cols.index(c)] = int(c[1:].replace(",", ""))

            if isinstance(cols[1], str):
                continue

            data.append(tuple(cols))

    data.sort(key=lambda x: float(x[3]) / float(x[1]))
    b = {}
    for a in data:
        b[a[0].replace('\xa0', '')] = (a[1], 100*(float(a[3]) / float(a[1])))

    for e, v in b.items():
        print(f"{e}\n    Gross receipts: {v[0]}\n    % Paid B&O: {v[1]}")


_get_data(URL)
