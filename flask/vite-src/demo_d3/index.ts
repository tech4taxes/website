// This is a javascript library file to be loaded & accessed under route /demo/d3 !
//
import * as d3 from "d3";

const container = document.getElementById("container");

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
We're gonna be someday`;

const splitData = rawData.split(/\s+/);

const data = {};
for (const item in splitData) {
  const li = splitData[item].toLowerCase();
  if (li in data) {
    data[li] += 1;
  } else {
    data[li] = 0;
  }
}

const freqs = [];
for (const item in data) {
  freqs.push({ word: item, freq: data[item] });
}

// Sort by frequency descending
freqs.sort((a, b) => b.freq - a.freq);

const nice = freqs.slice(0, 10);

// Declare the chart dimensions and margins.
const width = 1024;
const height = 750;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3
  .scaleBand()
  .domain(
    nice.map((x) => {
      return x.word;
    }),
  )
  .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3
  .scaleLinear()
  .domain([0, nice[0].freq + 5])
  .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3
  .create("svg")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("preserveAspectRatio", "xMidYMid meet");

// Add the x-axis.
svg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .attr("font-size", `2px`)
  .call(d3.axisBottom(x));

// Add the y-axis.
svg
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y));

// Create an SVG group that we will add the individual bar elements of our chart to
const bars = svg.append("g").attr("id", "bars-container");

// Bind the data to our .bars svg elements
// Create a rectangle for each data point and set position and dimensions using scales
bars
  .selectAll(".bar")
  .data(nice)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return x(d.word);
  })
  .attr("y", function (d) {
    return y(d.freq);
  })
  .attr("width", x.bandwidth() - 40)
  .attr("height", function (d) {
    return height - y(d.freq) - 50;
  });

// Append the SVG element.
container.append(svg.node());
