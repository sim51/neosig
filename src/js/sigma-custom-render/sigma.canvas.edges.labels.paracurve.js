;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.edges.labels');

  /**
   * This label renderer will just display the label on the line of the edge.
   * The label is rendered at half distance of the edge extremities, and is
   * always oriented from left to right on the top side of the line.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.labels.paracurve = function(edge, source, target, context, settings) {
    var prefix = settings('prefix') || '';

    var hidden = edge.hidden || false;
    var active = edge.active || false;
    var edgeOrder = edge.order || 0;
    var edgeColor = edge.color || settings('defaultEdgeColor');
    var edgeSize = edge[prefix + 'size'] || settings('defaultEdgeSize');
    var sourceX = source[prefix + 'x'];
    var sourceY = source[prefix + 'y'];
    var targetX = target[prefix + 'x'];
    var targetY = target[prefix + 'y'];

    if((!hidden) && (typeof edge.label === 'string') && (edgeSize >= settings('edgeLabelThreshold'))) {

      var controlPoint, point, angle;
      if (source.id === target.id) {
        controlPoint = sigma.canvas.utils.getSelfLoopControlPoints(sourceX, sourceY, source[prefix + 'size'], edgeSize, edgeOrder);
        point = sigma.utils.getPointOnBezierCurve(0.5,sourceX, sourceY, targetX, targetY, controlPoint.x1, controlPoint.y1, controlPoint.x2, controlPoint.y2);
        angle = Math.atan2(1, 1); // 45°
      }
      else {
        controlPoint = sigma.canvas.utils.getQuadraticControlPoint(sourceX, sourceY, targetX, targetY, edgeSize, edgeOrder);
        point = sigma.utils.getPointOnQuadraticCurve(0.5, sourceX, sourceY, targetX, targetY, controlPoint.x, controlPoint.y);
        var dX = targetX - sourceX,
            dY = targetY - sourceY,
            sign = (sourceX < targetX) ? 1 : -1;
        angle = Math.atan2(dY * sign, dX * sign);
      }

      context.save();

      var fontSize = settings('defaultEdgeLabelSize');
      if(settings('edgeLabelSize') !== 'fixed') {
        fontSize = fontSize * edgeSize * Math.pow(edgeSize, -1 / settings('edgeLabelSizePowRatio'));
      }
      context.font = [ settings('activeFontStyle'), fontSize + 'px', settings('activeFont') || settings('font')].join(' ');
      context.fillStyle = edgeColor;

      context.textAlign = 'center';
      context.textBaseline = 'alphabetic';
      context.translate(point.x, point.y);
      context.rotate(angle);
      context.fillText( edge.label, 0, (- edgeSize / 2) - 3 );

      context.restore();

    }

  };
}).call(this);
