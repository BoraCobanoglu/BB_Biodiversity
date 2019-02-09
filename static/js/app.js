function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(data).forEach(([key, value]) => {
      panel.append.text(`${key}: ${value}`)
      });
    });
}



  // @TODO: Use `d3.json` to fetch the sample data for the plots
  function buildCharts(sample) {
      d3.json(`/samples/${sample}`).then((data) => {
        const otu_ids = data.otu_ids;
        const otu_labels = data.otu_labels;
        const sample_values = data.sample_values;

    // @TODO: Build a Bubble Chart using the sample data

      var trace1 = [
          {
     x: otu_ids,
     y: sample_values,
     text: otu_labels,
     mode: "markers",
     name: 'ID - Values',
     options: options,
     marker: {
       size: sample_values,
       color: otu_ids,
     }
   }
 ];

 var bubbleLayout = {
   margin: { t: 0 },
   hovermode: "closest",
   xaxis: { title: "OTU ID" }

};
 Plotly.plot("bubble", trace1, bubbleLayout);



    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace2 = [
          {
            labels: otu_ids.slice(0, 10),
            values: sample_values.slice(0, 10),
            name: 'TOP 10',
            type: "pie"
          }
        ];
        var pieLayout = {
          height: 400,
          width: 500,
          grid: {rows: 2, columns: 2}
        };

        Plotly.plot("pie", trace2, pieLayout);
   });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
