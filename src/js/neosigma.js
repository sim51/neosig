import neo4j from "neo4j-driver/lib/browser/neo4j-web";

class NeoSigma {

  constructor(neo4jConfig, style) {
    this.style = style;
    this.driver = neo4j.driver(neo4jConfig.url, neo4j.auth.basic(neo4jConfig.user, neo4jConfig.password));
  }

  // Convert Cypher paramaters for the driver (ie cast interger)
  _convertParams(params) {
      var cast = {};
      Object.keys(params).map((key) => {
          var value = params[key];
          if (params[key] != null && Number.isFinite(params[key])) {
              value = neo4j.int(params[key]);
          }
          cast[key] = value
      })
      return cast;
  }

  _neo4jToSigmaNode(node){
    var sNode = {
      id: node.identity.toString(),
      labels: node.labels,
      properties: node.properties,
      x: Math.random(),
      y: Math.random(),
      size: 5,
      color: '#000',
      label: node.identity.toString()
    }

    // Look if there is a defined style for labels
    sNode.labels.forEach((value) => {
      if(this.style.labels){
        let style = this.style.labels[value];
        if(style) {
          sNode.size = style.size || 5;
          sNode.color = style.color || '#000';
          if(style.icon)
            sNode.icon = style.icon;
          sNode.label = sNode.properties[style.label] || sNode.id;
        }
      }
    });

    return sNode;
  }

  _neo4jToSigmaEdge(edge){
    var sEdge = {
      id: edge.identity.toString(),
      type: edge.type,
      source: edge.start.toString(),
      target: edge.end.toString(),
      properties: edge.properties,
      size: 2,
      color: '#000',
      label: edge.type,
      type:'paracurve'
    }

    // Look if there is a defined style for the edge type
    if(this.style.edges){
      let style = this.style.edges[sEdge.type];
      if(style) {
          sEdge.size =  style.size || 2;
          sEdge.color =  style.color || '#000';
          sEdge.label = sEdge.properties[style.label] || sEdge.type;
      }
    }

    return sEdge;
  }

  graph(query, params = {}) {
    let parameters = this._convertParams(params);
    let session = this.driver.session();
    return new Promise((resolve, reject) => {
      session.run(query, parameters)
        .then(
          (result) => {
            // empty graph object
            let graph = {nodes: [], edges: []};
            let nodesAlreadyProcess = [];
            let edgesAlreadyProcess = [];

            // for each rows
            result.records.forEach(record => {
              // for each column
              record.forEach((value, key) => {

                // if it's a node
                if (value && value.hasOwnProperty('labels')) {
                  if(nodesAlreadyProcess.indexOf(value.identity.toString()) === -1) {
                    graph.nodes.push(this._neo4jToSigmaNode(value));
                    nodesAlreadyProcess.push(value.identity.toString());
                  }
                }

                // if it's an edge
                if (value && value.hasOwnProperty('type')) {
                  if(edgesAlreadyProcess.indexOf(value.identity.toString()) === -1){
                    graph.edges.push(this._neo4jToSigmaEdge(value));
                    edgesAlreadyProcess.push(value.identity.toString());
                  }
                }

                // if it's a path
                if (value && value.hasOwnProperty('segments')) {
                  value.segments.forEach((seg) => {
                    if(nodesAlreadyProcess.indexOf(seg.start.identity.toString()) === -1){
                      graph.nodes.push(this._neo4jToSigmaNode(seg.start));
                      nodesAlreadyProcess.push(seg.start.identity.toString());
                    }
                    if(nodesAlreadyProcess.indexOf(seg.end.identity.toString()) === -1) {
                      graph.nodes.push(this._neo4jToSigmaNode(seg.end));
                      nodesAlreadyProcess.push(seg.end.identity.toString());
                    }
                    if(edgesAlreadyProcess.indexOf(value.identity.toString()) === -1) {
                      graph.edges.push(this._neo4jToSigmaEdge(seg.rel));
                      edgesAlreadyProcess.push(seg.rel.identity.toString());
                    }
                  })
                }
              });
            });

            resolve(graph);

          },
          (reason) => {
            reject(reason);
          }
        ).catch(error => {
          reject(error);
        });
      });
  }
}

export default NeoSigma;

export function neo4jGraph(neo, style, query, params) {
  return new NeoSigma(neo, style).graph(query, params);
}
