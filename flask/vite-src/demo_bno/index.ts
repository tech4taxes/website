// This is a javascript library file to be loaded & accessed under route /demo/bno !
//
import '../init.js';

import * as Plotly from 'plotly.js/dist/plotly';
import * as dfd from 'danfojs';


const D3Colors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf'
];

const really_big_color_list = Array(10).fill(D3Colors).flat()

// Load bno data:
dfd.readCSV("../../static/data/b_o_data.csv") //assumes file is in CWD
  .then(df => {

    df.sortValues("TaxRate", {inplace:true})
    const head = df.head()
    const tail = df.tail()

    const woohoo: Plotly.BarData[] = [
      {
        x: head.IndustryName.values.concat(tail.IndustryName.values),
        y: head.TaxRate.values.concat(tail.TaxRate.values),
        type: 'bar',
        marker: { color: really_big_color_list },
      },
    ];

    const container1 = document.getElementById("container1");
    Plotly.newPlot(container1, woohoo, {
      title: {text: "B&O Numbers Top 5 & Bottom 5"},
    });


    // Scatterplot of revenue to pct paid
    const container2 = document.getElementById("container2");
    Plotly.newPlot(container2, [{
      x: df.GrossRevenue.values,
      y: df.TaxRate.values,
      text: df.IndustryName.values,
      marker: { color: really_big_color_list},
      type: 'scatter',
      mode: 'markers',
    }],
      {
      title: {text: "Scatterplot Percentage paid vs. Revenue"},
      // margin: { t: 0 },
      automargin: true,
    });

    const formatter = new Intl.NumberFormat('en-US', {
	    style: 'currency',
	    currency: 'USD',
	    trailingZeroDisplay: "stripIfInteger"
    })
    // Table of raw data
    const container3 = document.getElementById("container3");
    let rawdf = df.drop({columns: [""]}) // The index is straight up a column named ""
    rawdf.addColumn("CurrencyTaxable", rawdf.Taxable.apply(formatter.format), {inplace: true})
    rawdf.addColumn("CurrencyGrossRevenue", rawdf.GrossRevenue.apply(formatter.format), {inplace: true})
    rawdf.addColumn("CurrencyBNOTax", rawdf.BNOTax.apply(formatter.format), {inplace: true})
    rawdf = rawdf.drop({columns: ["Taxable", "GrossRevenue", "BNOTax"]})
    rawdf.rename({"CurrencyTaxable": "Taxable", "CurrencyGrossRevenue": "Gross Revenue", "CurrencyBNOTax": "B&O Tax"}, {inplace: true})
    const botitle = "Washington State Department of Revenue B&O Quarterly Business Review 2025Q1"

    // "https://apps.dor.wa.gov/ResearchStats/Content/QuarterlyBusinessReview/Results5.aspx?Period=2025Q1&Type=naics&Format=HTML"
    rawdf.plot(container3).table({layout: {title: botitle}, scrollZoom: true});

  }).catch(err=>{
    console.log(err);
})


