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

    df.sortValues("PERCENTAGE_PAID", {inplace:true})
    const head = df.head()
    const tail = df.tail()

    const woohoo: Plotly.BarData[] = [
      {
        x: head.Name.values.concat(tail.Name.values),
        y: head.PERCENTAGE_PAID.values.concat(tail.PERCENTAGE_PAID.values),
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
      x: df.TOTAL_REVENUE.values,
      y: df.PERCENTAGE_PAID.values,
      text: df.Name.values,
      marker: { color: really_big_color_list},
      type: 'scatter',
      mode: 'markers',
    }],
      {
      title: {text: "Scatterplot Percentage paid vs. Revenue"},
      // margin: { t: 0 },
      automargin: true,
    });
  }).catch(err=>{
    console.log(err);
})


