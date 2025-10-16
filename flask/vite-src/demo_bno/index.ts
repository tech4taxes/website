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
  '#17becf'
];

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
        marker: { color:D3Colors },
      },
    ];

    const container1 = document.getElementById("container1");
    Plotly.newPlot(container1, woohoo, {
      title: {text: "B&O Numbers First 5"},
    });

  }).catch(err=>{
    console.log(err);
})


const container2 = document.getElementById("container2");
Plotly.newPlot(container2, [{
  x: [1, 2, 3, 4, 5],
  y: [1, 2, 4, 8, 16] }],
  {
  title: {text: "Squared Numbers"},
  margin: { t: 0 },
});
