const parseBibTex = (x) => {
    return bibtexParse.toJSON(x).map((x) => x.entryTags.JOURNAL);
};

const summariseBibTex = (x) => {
    const counts = R.countBy(R.identity)(x.filter(R.identity));
    const valuePairs = R.map((k) => ({journal: k, count: counts[k]}), R.keys(counts));
    return R.take(20, R.reverse(R.sortBy((x) => x.count, valuePairs)));
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
                    "color": "darkgray"
                }
            },
            {
                "mark": {
                    "type": "text",
                    "color": "white",
                    "dx": 15
                },
                "encoding": {"x": {"value": 0}}
            }
        ],
        "title": {
            "text": x.title,
            "subtitle": x.date,
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
    var inputData = document.getElementById("input").value;
    var currentDate = new Date();
    R.compose(R.partial(vegaEmbed, ['#vis']),
              (d) => {
                  return plotSpec({data: d,
                                   title: "Journal Frequency",
                                   date:currentDate.toDateString()})},
              summariseBibTex,
              parseBibTex)(inputData);
};

document.getElementById("input").value = '@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={B}}\n@article{foo, journal={A}} \n@article{foo, journal={A}}\n@article{foo, journal={A}} \n@article{foo, journal={B}}\n@article{foo, journal={C}} \n@article{foo, journal={D}}\n@article{foo, journal={A}} \n@article{foo, journal={B}}\n@article{foo, journal={F}} \n@article{foo, journal={E}}'

document.getElementById("submit").onclick = doIO;
