const parseBibTex = (x) => {
    x.data = bibtexParse.toJSON(x.data).map((x) => x.entryTags.JOURNAL);
    return x;
};

const summariseBibTex = (x) => {
    const counts = R.countBy(R.identity)(x.data.filter(R.identity));
    const valuePairs = R.map((k) => ({journal: k, count: counts[k]}), R.keys(counts));
    x.data = R.take(x.config.numEntries, R.reverse(R.sortBy((x) => x.count, valuePairs)));
    return x;
};

const plotSpec = (x) => {
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
            "values": x.data
        },
        "encoding": {
            "x": {
                "field": "count",
                "type": "quantitative",
                "title": null,
                "scale": {"type": "symlog", "domain": [0, 100]},
                "axis": {
                    "values": [1, 10, 100]
                }
            },
            "text": {"field": "count"},
            "y": {
                "field": "journal",
                "type": "nominal",
                "axis": {"labelAngle": 0},
                "sort": "-count",
                "title": null
            }
        },
        "layer": [
            {
                "mark": {
                    "type": "bar",
                    "color": x.config.colours.bar
                }
            },
            {
                "mark": {
                    "type": "text",
                    "color": x.config.colours.annotations,
                    "dx": 15
                },
                "encoding": {"x": {"value": 0}}
            }
        ],
        "title": {
            "text": x.config.title,
            "subtitle": x.config.date,
            "align": "left",
            "anchor": "start",
            "fontSize": 20,
            "subtitleFontSize": 15
        },
        "width": 500,
        "height": 500
    };
};

const doIO = () => {
    var currentDate = new Date();
    var state = {data: document.getElementById("input").value,
                 config: {title: document.getElementById("plot-title").value,
                          numEntries: parseInt(document.getElementById("plot-num").value),
                          colours: {bar: document.getElementById("plot-bar-col").value,
                                    annotations: document.getElementById("plot-ann-col").value},
                          date: currentDate.toDateString()}};
    R.compose(R.partial(vegaEmbed, ['#vis']),
              plotSpec,
              summariseBibTex,
              parseBibTex)(state);
};

document.getElementById("input").value = '@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={A}} \n@article{foo, journal={A}}\n@article{foo, journal={A}} \n@article{foo, journal={B}}\n@article{foo, journal={C}} \n@article{foo, journal={D}}\n@article{foo, journal={A}} \n@article{foo, journal={B}}\n@article{foo, journal={F}} \n@article{foo, journal={E}}'

document.getElementById("submit").onclick = doIO;

// This section toggles the display of the visualisation configuration.
var coll = document.getElementsByClassName("collapsible")[0];
coll.addEventListener("click", () => {
    var content = coll.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    };
});
