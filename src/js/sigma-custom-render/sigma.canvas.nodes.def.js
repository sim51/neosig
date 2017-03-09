;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '';

    // Compute variables
    var nodeColor = node.color || settings('defaultNodeColor');
    var hidden = node.hidden || false;
    var active = node.active || false;
    var activeNodeBorderColor = settings('activeNodeBorderColor') || '#FF0000';
    var activeNodeBorderSizeRatio = settings('activeNodeBorderSizeRatio') || 0.1;
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var nodeSize = node[prefix + 'size'] || settings('defaultNodeSize');

    if(!hidden) {

      // Display active border if node is seleted
      if(node.selected) {

        let whiteSize = (nodeSize + 1);
        let activeSize = whiteSize * (1 + activeNodeBorderSizeRatio);
        sigma.canvas.utils.drawCircle(context, nodeX, nodeY, activeSize, activeNodeBorderColor);
        sigma.canvas.utils.resetContext(context);
        sigma.canvas.utils.drawCircle(context, nodeX, nodeY, whiteSize, '#FFF');
      }

      // Display main node
      sigma.canvas.utils.drawCircle(context, nodeX, nodeY, nodeSize, nodeColor);

      // Display node icon
      if(node.icon) {
        sigma.canvas.utils.drawNodeIcon(context, node, prefix);
      }

      // Display node image
      if(node.image && node.image.url) {
        sigma.canvas.utils.drawNodeImage(context, node, prefix);
      }

      sigma.canvas.utils.resetContext(context);
    }
  };

})();
