;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * The default edge renderer. It renders the edge as a simple line.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.paracurve = function(edge, source, target, context, settings) {
    var prefix = settings('prefix') || '';

    // Compute variables
    var edgeColor = edge.color || settings('defaultEdgeColor');
    var hidden = edge.hidden || false;
    var active = edge.active || false;
    var edgeOrder = edge.order || 0;
    var activeBorderColor = settings('activeBorderColor') || '#FF0000';
    var activeBorderSizeRatio = settings('activeBorderSizeRatio') || 0.1;
    var edgeSize = edge[prefix + 'size'] || settings('defaultEdgeSize');
    var sourceX = source[prefix + 'x'];
    var sourceY = source[prefix + 'y'];
    var targetX = target[prefix + 'x'];
    var targetY = target[prefix + 'y'];

    if(!hidden) {

      if(active){
        if(source.id === target.id)
          sigma.canvas.utils.drawSelfEdgeArrow(context, sourceX, sourceY, source[prefix + 'size'], activeBorderColor, edgeSize * activeBorderSizeRatio, edgeOrder);
        else
          sigma.canvas.utils.drawEdgeArrow(context, sourceX, sourceY, targetX, targetY, target[prefix + 'size'], activeBorderColor, edgeSize * activeBorderSizeRatio, edgeOrder);
      }

      if(source.id === target.id)
        sigma.canvas.utils.drawSelfEdgeArrow(context, sourceX, sourceY, source[prefix + 'size'], edgeColor, edgeSize, edgeOrder);
      else
        sigma.canvas.utils.drawEdgeArrow(context, sourceX, sourceY, targetX, targetY, target[prefix + 'size'], edgeColor, edgeSize, edgeOrder);
    }
  };

})();
