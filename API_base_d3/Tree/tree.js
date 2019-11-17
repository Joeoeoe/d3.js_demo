const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 *
 *
 * @param {Array} data 传入数据
 * @param {Number} width 图表宽度
 * @param {Number} height 图表高度，在制作图表中会适当
 * @param {String} eleSelector 插入图表的元素名
 * @param {String} linkColor link颜色
 * @param {String} nodeColor 配置node颜色
 * @param {Number} nodeRadius 设置节点半径
 * @param {String} textDy text偏移量
 * //TODO 如何定义class与样式，是否能交给用户更多的自主权？
 */
function cerateTree(
  data,
  width,
  height,
  eleSelector,
  linkColor,
  nodeColor,
  nodeRadius,
  textDy
) {
  const clonedData = deepClone(data);
  const container = d3.select(eleSelector);
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //y轴微调
  const g = svg.append("g").attr("transform", "translate(0, 20)");

  const hierarchyData = d3.hierarchy(clonedData);

  const treeLayout = d3
    .tree()
    .size([width, height - 30])
    .separation((a, b) => {
      return a.parent === b.parent ? 1 : 2;
    });

  const nodesData = treeLayout(hierarchyData);

  //画线
  const links = g
    .selectAll("path")
    .data(nodesData.descendants().slice(1))
    .enter()
    .append("path")
    .attr('fill', 'none')
    .attr("stroke", linkColor)
    .attr("d", d => {
      return `
        M${d.x},${d.y}
        C${d.x},${(d.y + d.parent.y) / 2}
        ${d.parent.x},${(d.y + d.parent.y) / 2.5}
        ${d.parent.x},${d.parent.y}`;
    });

  const nodes = g
    .selectAll("g")
    .data(nodesData.descendants())
    .enter()
    .append("g")
    .attr("transform", d => {
      return `translate(${d.x}, ${d.y})`;
    });

  // 画圆
  nodes
    .append("circle")
    .attr("r", nodeRadius)
    .attr("fill", nodeColor);

  // 文字
  nodes
    .append("text")
    .attr("dx",textDy) //TODO 文字偏移如何设置参数
    .text(d => {
      return d.data.name;
    });
}

const data = {
  name: "root",
  children: [
    {
      name: "二级节点1",
      children: [
        {
          name: "A",
          value: "叶子节点"
        },
        {
          name: "B",
          value: "叶子节点"
        }
      ]
    },
    {
      name: "二级节点2",
      children: [
        {
          name: "C",
          value: "叶子节点"
        },
        {
          name: "D",
          value: "叶子节点"
        }
      ]
    }
  ]
};
