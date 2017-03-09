;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edgehovers');

  /**
   * This hover renderer will display the edge with a different color or size.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edgehovers.paracurve = function(edge, source, target, context, settings) {

      // for hover, we just print the usual node with a shadow blur
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 15;
      context.shadowColor = settings('labelHoverShadowColor');

      // Edge
      var edgeRenderer = sigma.canvas.edges[edge.type] || sigma.canvas.edges.def;
      edgeRenderer(edge, source, target, context, settings);

      // testing if edge label plugin is loaded
      if(sigma.canvas.edges.labels) {
        var edgeLabelRenderer = sigma.canvas.edges.labels[edge.type] || sigma.canvas.edges.labels.def;
        edgeLabelRenderer(edge, source, target, context, settings);
      }

      sigma.canvas.utils.resetContext(context);
  };
})();
