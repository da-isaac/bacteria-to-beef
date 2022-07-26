function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// DELIVERABLE 1:

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples
    //console.log(samples);
    // 4. Create a variable that filters the samples for the
    // object with the desired sample number.
    let id_samples_array = samples.filter(values => values.id == sample);
    //console.log(id_samples_array);
    let sorted_samples = id_samples_array.sort((a,b) => b.sample_values - a.sample_values);
    //console.log("Sorted Samples");
    //console.log(sorted_samples);
    //  5. Create a variable that holds the first sample in the array.
    let id_samples_object = sorted_samples[0];
    //console.log("First Samples");
    //console.log(id_samples_object);
    // 6. Create variables that hold the otu_ids, otu_labels, and 
    // sample_values.

    let otu_ids_array = id_samples_object.otu_ids;
    let otu_ids_object = Object.entries(otu_ids_array).slice(0, 10).reverse();
    let otu_ids = otu_ids_object.map(value => value[1]);
    //console.log(otu_ids);

    let otu_labels_array = id_samples_object.otu_labels;
    let otu_labels_object = Object.entries(otu_labels_array).slice(0, 10).reverse();
    let otu_labels = otu_labels_object.map(value => value[1]);
    //console.log(otu_labels);

    let sample_values_array = id_samples_object.sample_values;
    let sample_values_object = Object.entries(sample_values_array).slice(0, 10).reverse();
    let sample_values = sample_values_object.map(value => value[1]);
    //console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids;

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: sample_values,
      y: yticks.map(tick => "OTU " + tick),
      type: "bar",
      text: otu_labels,
      orientation: 'h'
    };
    var barData = [
      barTrace
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
      //xaxis: {title: "OTU ID"},
      //yaxis: {title: "No. of Cultures"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // DELIVERABLE 2:

    // 1. Create the trace for the bubble chart.
    let bubble_otu_ids_array = id_samples_object.otu_ids;
    let bubble_otu_ids_object = Object.entries(bubble_otu_ids_array);
    let bubble_otu_ids = bubble_otu_ids_object.map(value => value[1]);
    //console.log(otu_ids);

    let bubble_otu_labels_array = id_samples_object.otu_labels;
    let bubble_otu_labels_object = Object.entries(bubble_otu_labels_array);
    let bubble_otu_labels = bubble_otu_labels_object.map(value => value[1]);
    //console.log(otu_labels);

    let bubble_sample_values_array = id_samples_object.sample_values;
    let bubble_sample_values_object = Object.entries(bubble_sample_values_array);
    let bubble_sample_values = bubble_sample_values_object.map(value => value[1]);

    var bubbleTrace = {
      x: bubble_otu_ids,
      y: bubble_sample_values,
      mode: "markers",
      marker: {
        color: bubble_otu_ids,
        size: bubble_sample_values
      },
      text: bubble_otu_labels
    };
    var bubbleData = [
      bubbleTrace
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    
    // DELIVERABLE 3:

    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let wfreq = parseFloat(result.wfreq);
    console.log(wfreq);
    console.log("83.0");

    // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      domain: {x: [0, 1], y: [0, 1]},
      value: wfreq,
      title: "Belly Button Washing Frequency",
      annotations: [
        {
          text: "Test"
        }
      ],
      subtitle: "Scrubs per Week",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "#74ba45"},
          {range: [8, 10], color: "green"}
        ]
      }
    };
    var gaugeData = [
      gaugeTrace
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}