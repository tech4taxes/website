// This is a javascript library file to be loaded & accessed under route /demo/bno !
//
import '../init.js';

import * as Plotly from 'plotly.js/dist/plotly';
import * as dfd from 'danfojs';


function generateRandomOrangeColor(): string {
    const red = Math.floor(Math.random() * 56) + 200; 
    const green = Math.floor(Math.random() * 66) + 100; 
    const blue = Math.floor(Math.random() * 51) + 0; 

    // Convert RGB values to hexadecimal and pad with leading zeros if necessary
    const toHex = (c: number): string => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}


// Load bno data:
dfd.readCSV("../../static/data/b_o_data.csv") //assumes file is in CWD
  .then(df => {

    df.sortValues("TaxRate", {inplace:true})

    const xvals = df.apply(
      (row) => {
        return row[5];
      },
      {axis: 1},
    ).values;

    const initial_columns = [
      "Hospitals",
      "Semiconductors",
      "Home Health Care",
      "Social Services Day Care",
      "Personal Care barber Beauty Etc",
      "Aircraft Aerospace Parts",
      "Software",
    ];

    const yvals = df.apply(
      (row) => {
        return row[6];
      },
      {axis: 1},
    ).values;

    const pointColors = df.GrossRevenue.values.map(() => generateRandomOrangeColor())
    const bno_bars = []
    for (let i = 0; i < xvals.length; ++i) {
      let is_visible = 'legendonly';
      const industryname = xvals[i] as string
      if (initial_columns.includes(industryname)) {
        is_visible = 'true';
      }
      bno_bars.push(
        {
          x: [industryname],
          y: [yvals[i]],
          type: 'bar',
          legendgroup: industryname,
          showlegend: true,
          name: industryname,
          visible: is_visible,
          marker: {
            color: generateRandomOrangeColor()
          }
        }
      )
    }

    const container1 = document.getElementById("container1");
    Plotly.newPlot(container1, bno_bars, {
      title: {
        text: "B&O Tax: Tax Rate by Industry Name", 
        font: {size: 20}
      },
      visible: "legendonly",
      showlegend: true,
      xaxis: {
        title: {
          text: 'Industry Name',
          standoff: 10,
          font: {size: 20},
        },
        automargin: true,
      },
      yaxis: {
        title: {
          text: 'Tax Rate',
          standoff: 10,
          font: {size: 20},
        },
        tickformat: '.2%'
      },
    });


    // Scatterplot of revenue to pct paid
    const container2 = document.getElementById("container2");
    Plotly.newPlot(container2, [{
      x: df.GrossRevenue.values,
      y: df.TaxRate.values,
      text: df.IndustryName.values,
      marker: {color: pointColors},
      type: 'scatter',
      mode: 'markers',
    }],
      {
      title: {
        text: "Scatterplot Tax Rate paid vs. Gross Revenue",
        font: {size: 20},
      },
      automargin: true,
      xaxis: {
        title: {
          text: 'Gross Revenue',
          standoff: 10,
          font: {size: 20},
        },
        automargin: true,
      },
      yaxis: {
        title: {
          text: 'Tax Rate',
          standoff: 10,
          font: {size: 20},
        },
        tickformat: '.2%'
      },
    });

    const formatter = new Intl.NumberFormat('en-US', {
	    style: 'currency',
	    currency: 'USD',
    })
    // Table of raw data
    let rawdf = df.drop({columns: [""]}) // The index is straight up a column named ""
    rawdf.addColumn("CurrencyTaxable", rawdf.Taxable.apply(formatter.format), {inplace: true})
    rawdf.addColumn("CurrencyGrossRevenue", rawdf.GrossRevenue.apply(formatter.format), {inplace: true})
    rawdf.addColumn("CurrencyBNOTax", rawdf.BNOTax.apply(formatter.format), {inplace: true})
    rawdf = rawdf.drop({columns: ["Taxable", "GrossRevenue", "BNOTax"]})
    rawdf.rename({"CurrencyTaxable": "Taxable", "CurrencyGrossRevenue": "Gross Revenue", "CurrencyBNOTax": "B&O Tax"}, {inplace: true})
    const botitle = "Washington State Department of Revenue B&O Quarterly Business Review 2025Q1"

    // "https://apps.dor.wa.gov/ResearchStats/Content/QuarterlyBusinessReview/Results5.aspx?Period=2025Q1&Type=naics&Format=HTML"
    rawdf.plot("container3").table({layout: {title: botitle}});

  }).catch(err=>{
    console.log(err);
})


