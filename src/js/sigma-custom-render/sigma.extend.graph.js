;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw new Error('sigma is not declared');

    if (!sigma.classes.graph.hasMethod('getNeighbors')) {
      sigma.classes.graph.addMethod('getCardinalityBetweenNodes', function(source, target) {
        let result = 0;

        let neighbors = this.inNeighborsIndex[source];
        if (neighbors[target]){
          result = Object.keys(neighbors[target]).length;
        }
        return result;
      });
    }

    sigma.classes.graph.attach( 'addEdge', 'sigma.extend.graph.addEdge', function(edge) {
      let card = this.getCardinalityBetweenNodes(edge.source, edge.target);
      this.edges(edge.id).order = card;
    });


}).call(this);
