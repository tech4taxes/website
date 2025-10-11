// This is a javascript library file to be loaded & accessed under route /demo/plotly !
//
import '../init.js';
import * as d3 from 'd3';
import * as Plotly from 'plotly.js/dist/plotly';


const rawData = `Ohh
La la la la la
Ohh
Yeah

I know it might be crazy
But did you hear the story?
I think I heard it vaguely
A girl and a zombie
Oh, tell me more, boy
Sounds like a fantasy
Oh, what could go so wrong
With a girl and a zombie
You're from the perfect paradise
And I'm living on the darker side
Ooh, I've got a feeling
If you get to know me
Right from the start, you caught my eye
And something inside me came to life
Ooh, I've got a feeling
If you get to know me

Someday
This could be, this could be ordinary
Someday
Could we be something extraordinary?
You and me side by side
Out in the broad daylight
If they laugh, we'll say
We're gonna be someday
We're gonna be someday
Someday, someday
We're gonna be someday
We're gonna be someday

Girl, you look delicious
Oh, I mean gorgeous
Well, now you're getting fearless
No, I'm just rooting for us
If different was a superpower
We'd be so flawless
Yeah, we could make these two worlds ours
I'm rooting for us
Two lonely hearts meet in the dark
Imagine it now they start a spark
You got my attention
What happens next, then?
Movies and long walks in the park
Hanging out anywhere we want
I like the way you're thinking
I can almost see it

Someday
This could be, this could be ordinary
Someday
Could we be something extraordinary?
You and me side by side
Out in the broad daylight
If they laugh, we'll say
We're gonna be someday
Someday, someday

So let them talk if they wanna
Let them talk if they're gonna
We're gonna do what we wanna
Let them talk, let them talk
If they wanna, they wanna

Someday
This could be, this could be ordinary
Someday
Could we be something extraordinary?
You and me side by side
Out in the broad daylight
If they laugh, we'll say
We're gonna be someday
Someday, someday
We're gonna be someday
Someday, someday
We're gonna be someday`

const splitData = rawData.split(/\s+/)

const data = {}
for (const item in splitData) {
  const li = splitData[item].toLowerCase()
  if (li in data) {
    data[li] += 1
  } else {
      data[li] = 0
  }
  
}


const words = Object.keys(data)

const freqs = []
for (const item in data) {
    freqs.push( {word: item, freq: data[item]})
}

// Sort by frequency descending
freqs.sort((a, b) => b.freq - a.freq);

const nice = freqs.slice(0, 10)

// Do plotly magic

const woohoo: Plotly.BarData[] = [
  {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    type: 'bar'
  },
];

const container1 = document.getElementById("container1");
Plotly.newPlot(container1, woohoo, {
  title: {text: "Cool Animal Numbers"},
});

const container2 = document.getElementById("container2");
Plotly.newPlot(container2, [{
  x: [1, 2, 3, 4, 5],
  y: [1, 2, 4, 8, 16] }],
  {
  title: {text: "Squared Numbers"},
  margin: { t: 0 },
});


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

const container3 = document.getElementById("container3");
Plotly.newPlot(container3, [{
  x: nice.map(d => d.word),
  y: nice.map(d => d.freq),
  marker: { color:D3Colors },
  type: 'bar',
}],
{
  title: {text: "We're gonna be someday"},
  xaxis: {title: {text: "Words"}, type: "category"},
  yaxis: {title: {text: "Frequency"}},
});

