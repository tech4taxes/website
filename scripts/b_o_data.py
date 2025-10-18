""" b_o_data.py -
Scrape Washington Business & Occupation tax data & wrangle it into a nice shape.
"""
import re
import requests
from bs4 import BeautifulSoup
import pandas as pd

URL = (
    "https://apps.dor.wa.gov/ResearchStats/Content/QuarterlyBusinessReview/"
    "Results5.aspx?Period=2025Q1&Type=naics&Format=HTML"
)

NAICS_CAT = {
        11: "Agriculture, Forestry, Fishing",
        21: "Mining",
        22: "Utilities",
        23: "Construction",
        31: "Manufacturing",
        32: "Manufacturing",
        33: "Manufacturing",
        42: "Wholesale Trade",
        44: "Retail Trade",
        45: "Retail Trade",
        48: "Transportation",
        49: "Transportation",
        51: "Information",
        52: "Finance, Insurance, Real Estate",
        53: "Finance, Insurance, Real Estate",
}

# _get_data pulls given google doc link from the web and parses the HTML content into
# a nice dict for use
def _get_data(link):
    # Use the BeautifulSoup library to parse the HTML and pull out the table containing coords
    document = requests.get(link, timeout=10)
    html_content = BeautifulSoup(document.text, features="html.parser")
    tables = html_content.find_all("table")
    columns = ["IndustryNaics", "GrossRevenue", "Taxable", "BNOTax"]
    rows = []

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

            r = dict(zip(columns, cols))
            rows.append(r)

    df = pd.DataFrame(rows)
    df.to_csv("bno_raw.csv")
    return df

def clean_raw(df):
    # Remove whitespace
    df["IndustryNaics"] = df.apply(lambda row: row["IndustryNaics"].replace('\xa0', '').replace(',', ' '), axis=1)
    # Split out NAICS number
    df["NAICS"] = df.apply(lambda row: re.findall(r"\d+", row["IndustryNaics"]), axis=1)
    df["IndustryName"] = df.apply(lambda row: " ".join(re.findall("[a-zA-Z]+", row["IndustryNaics"])), axis=1)
    df["TaxRate"] = df["BNOTax"] / df["GrossRevenue"]
    
    # Non-unique industry names that need the parens to make unique
    vals = df["IndustryName"].value_counts() 
    vals = list(vals[vals >=2].keys())
    df = df.reset_index()
    for name in vals: 
        df_name = df[df["IndustryName"] == name]
        for idx, row in df_name.iterrows():
            n = row["NAICS"][0][:2] 
            full_name = row["IndustryName"] + " (" +  NAICS_CAT.get(int(n)) + ")"
            df.loc[row["index"], "IndustryName"] = full_name

    df = df.drop(["IndustryNaics", "index"], axis=1)

    return df

if __name__ == "__main__":
    df_raw = _get_data(URL)
    df = clean_raw(df_raw)
    df.to_csv("../flask/static/data/b_o_data.csv")