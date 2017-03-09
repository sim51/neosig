;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.utils');

  sigma.canvas.utils.drawCircle = function(context, x, y, size, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  sigma.canvas.utils.drawNodeIcon = function(context, node, prefix) {
    var color = node.icon.color || '#000';
    var scale = node.icon.scale || 0.7;
    var text = String.fromCharCode("0x" + node.icon.name)  || '?';
    var nodeSize = node[prefix + 'size'];
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var fontSize = Math.round(scale * nodeSize);

    context.save();
    context.fillStyle = color;
    context.font = '' + fontSize + 'px fontawesome';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, nodeX, nodeY);
    context.restore();
  };

  sigma.canvas.utils.drawArrow = function(context, aX, aY, bX, bY, cX, cY, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(aX, aY);
    context.lineTo(bX, bY);
    context.lineTo(cX, cY);
    context.lineTo(aX, aY);
    context.closePath();
    context.fill();
  }

  sigma.canvas.utils.drawSelfEdgeArrow = function(context, nodeX, nodeY, nodeSize, color, size, order) {
    var controlPoint = sigma.canvas.utils.getSelfLoopControlPoints(nodeX, nodeY, nodeSize, size, order);

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(nodeX, nodeY);
    context.bezierCurveTo(controlPoint.x2, controlPoint.y2, controlPoint.x1, controlPoint.y1, nodeX, nodeY);
    context.stroke();

    var d = Math.sqrt(Math.pow(nodeX - controlPoint.x1, 2) + Math.pow(nodeY - controlPoint.y1, 2));
    var aX = controlPoint.x1 + (nodeX - controlPoint.x1) * (d - size * 2 - nodeSize) / d;
    var aY = controlPoint.y1 + (nodeY - controlPoint.y1) * (d - size * 2 - nodeSize) / d;
    var vX = (nodeX - controlPoint.x1) * nodeSize / d;
    var vY = (nodeY - controlPoint.y1) * nodeSize / d;
    sigma.canvas.utils.drawArrow(context, (aX + vX), (aY + vY), (aX + vY * 0.6), (aY - vX * 0.6), (aX - vY * 0.6), (aY + vX * 0.6), color);
  }

  sigma.canvas.utils.drawEdgeArrow = function(context, sourceX, sourceY, targetX, targetY, targetSize, color, size, order) {
    var controlPoint = sigma.canvas.utils.getQuadraticControlPoint(sourceX, sourceY, targetX, targetY, size, order);

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(sourceX, sourceY);
    context.quadraticCurveTo(controlPoint.x, controlPoint.y, targetX, targetY);
    context.stroke();

    var d = Math.sqrt(Math.pow(targetX - controlPoint.x, 2) + Math.pow(targetY - controlPoint.y, 2));
    var aX = controlPoint.x + (targetX - controlPoint.x) * (d - size * 7 - targetSize) / d;
    var aY = controlPoint.y + (targetY - controlPoint.y) * (d - size * 7 - targetSize) / d;
    var vX = (targetX - controlPoint.x) * targetSize / d;
    var vY = (targetY - controlPoint.y) * targetSize / d;
    sigma.canvas.utils.drawArrow(context, (aX + vX), (aY + vY), (aX + vY * 0.6), (aY - vX * 0.6), (aX - vY * 0.6), (aY + vX * 0.6), color);
  }


  /**
   * Reset the canvas context with default value.
   *
   * @param {object} context The canvas context
   */
  sigma.canvas.utils.resetContext = function(context) {
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    context.shadowColor = 0;
    context.fillStyle = '#000';
  }

  /**
   * Return the control point coordinates for a quadratic bezier curve.
   *
   * @param  {number} x1       The X coordinate of the start point.
   * @param  {number} y1       The Y coordinate of the start point.
   * @param  {number} x2       The X coordinate of the end point.
   * @param  {number} y2       The Y coordinate of the end point.
   * @param  {number} edgeSize The edge size.
   * @param  {number} order    Modifier for the amplitude of the curve.
   * @return {x,y}             The control point coordinates.
   */
  sigma.canvas.utils.getQuadraticControlPoint = function(x1, y1, x2, y2, edgeSize, order) {
    order = order || 0;
    return {
      x: (x1 + x2) / 2 + (y2 - y1) / (60 / (5 + order * Math.log(edgeSize + 1) * 5)),
      y: (y1 + y2) / 2 + (x1 - x2) / (60 / (5 + order * Math.log(edgeSize + 1) * 5))
    };
  };

  /**
   * Return the coordinates of the two control points for a self loop (i.e.
   * where the start point is also the end point) computed as a cubic bezier
   * curve.
   *
   * @param  {number} x        The X coordinate of the node.
   * @param  {number} y        The Y coordinate of the node.
   * @param  {number} nodeSize The node size.
   * @param  {number} edgeSize The edge size.
   * @param  {number} order    Modifier to the loop size.
   * @return {x1,y1,x2,y2}     The coordinates of the two control points.
   */
  sigma.canvas.utils.getSelfLoopControlPoints = function(x , y, nodeSize, edgeSize, order) {
    order = order || 0;
    return {
      x1: x - (nodeSize * (order+1)) * Math.log(edgeSize + 1),
      y1: y,
      x2: x,
      y2: y + (nodeSize * (order+1) ) * Math.log(edgeSize + 1)
    };
  };

})();
