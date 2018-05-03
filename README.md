# NeoSig

An integration of `Sigma.js` with `Neo4j`, with some customs renderers to make parallele curves

## How to use it

* Import the script

```
<script type="text/javascript" src="https://rawgit.com/sim51/neosig/master/docs/neosig.bundle-1.2.1.js"></script>
```

* Import `neo4j-driver`

```
<script src="https://cdn.jsdelivr.net/npm/neo4j-driver"></script>
```

* OPTINAL: Import `fontawesome` if you need to display some icons

```
<script src="https://use.fontawesome.com/bd149a0111.js"></script>
```

* Create an object configuration for Neo4j

```
var neo4j = {
    url: 'bolt://localhost',
    user: 'neo4j',
    password: 'admin',
    driver: {} // this is the neo4j driver configuration if neede (you can omit it
};
```

* Create a graph style object :

```
var style = {
    labels: {
      Person : {
          // field to display (if ommit, node's id will be displayed)
          label: 'name',
          color: '#654321',
          size: 10,
          icon: {
              // the fontawesome unicode
              name: 'f007',
              color: '#FFF',
              scale: 1.0
          }
      },
      Movie : {
          label: 'title',
          color: '#123456',
          size: 10,
          icon: {
            name: 'f008',
            color: '#FFF',
            scale: 1.0
          }
      }
    },
    edges: {
        ACTED_IN: {
            color: '#040404',
            size:2
        },
        DIRECTED: {
            color: '#040404',
            size:2
        }
    }
};
```


* Call the `Neo4jGraph` function to get the result of your query as a graph structure compatible with Sigma.
This function takes 4 attributs :
** The Neo4j configuration object
** The graph style object
** A cypher query
** Parameters of the cypher query

[source,javascript]
----
Neo4jGraph(neo4j, style, 'MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 20').then( function(result) {

      var sig = new sigma({
          graph: result,
          renderer: {
            container: 'graph-container'
          },
          settings: {
            edgeLabelThreshold:1,
            drawEdgeLabels:true,
            edgeLabelSize:'fixed',
            defaultEdgeLabelSize:8,
            enableEdgeHovering: true,
            edgeHoverExtremities: true
          }
      });

      // enable drag'n'drop
      sigma.plugins.dragNodes(sig, sig.renderers[0]);

      // start layout
      sig.startForceAtlas2();
      setTimeout(() => { sig.stopForceAtlas2() }, Math.log(result.nodes.length*result.edges.length)*1000);

});
----

== Example

If you have a running `Neo4j` with the movie dataset on your local computer, and if the neo4j user password is `admin`, you can test it here : https://sim51.github.io/neosig/
