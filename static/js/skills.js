export function renderSkillBars(skillTypes, returnAsString = false) {
  if (!skillTypes || !Array.isArray(skillTypes.nodes)) {
    console.error("Invalid skillTypes input to renderSkillBars:", skillTypes);
    return returnAsString ? '' : null;
  }

  // Dimensions for vertical bar chart
  const width = 600;
  const height = 450; // Increased height to accommodate vertical text
  const margin = { top: 40, right: 30, bottom: 100, left: 60 }; // Increased bottom margin
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barPadding = 0.3;

  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Create chart group with margins
  const chart = document.createElementNS("http://www.w3.org/2000/svg", "g");
  chart.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
  svg.appendChild(chart);

  // Sort skills by amount (descending)
  const sortedSkills = [...skillTypes.nodes].sort((a, b) => b.amount - a.amount);

  // Calculate scales
  const maxValue = Math.max(...sortedSkills.map(skill => skill.amount), 100);
  const barWidth = chartWidth / sortedSkills.length * (1 - barPadding);

  // Add X axis (skill names) - Vertical text
  sortedSkills.forEach((skill, i) => {
    const xPos = i * (chartWidth / sortedSkills.length) + (chartWidth / sortedSkills.length / 2);
    
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", xPos);
    label.setAttribute("y", chartHeight + 50); // Position below chart
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12px");
    label.setAttribute("transform", `rotate(-45, ${xPos}, ${chartHeight + 50})`); // Rotate text
    label.textContent = skill.type;
    chart.appendChild(label);
  });

  // Add Y axis (percentage)
  for (let i = 0; i <= 100; i += 20) {
    const yPos = chartHeight - (i / 100 * chartHeight);
    
    // Grid line
    const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gridLine.setAttribute("x1", 0);
    gridLine.setAttribute("y1", yPos);
    gridLine.setAttribute("x2", chartWidth);
    gridLine.setAttribute("y2", yPos);
    gridLine.setAttribute("stroke", "#eee");
    gridLine.setAttribute("stroke-width", "1");
    chart.appendChild(gridLine);

    // Percentage label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", -10);
    label.setAttribute("y", yPos + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "10px");
    label.textContent = `${i}%`;
    chart.appendChild(label);
  }

  // Add bars
  sortedSkills.forEach((skill, i) => {
    const xPos = i * (chartWidth / sortedSkills.length) + (chartWidth / sortedSkills.length * barPadding / 2);
    const barHeight = (skill.amount / maxValue) * chartHeight;
    
    // Bar background (full 100%)
    const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bgRect.setAttribute("x", xPos);
    bgRect.setAttribute("y", chartHeight - (100 / maxValue * chartHeight));
    bgRect.setAttribute("width", barWidth);
    bgRect.setAttribute("height", 100 / maxValue * chartHeight);
    bgRect.setAttribute("fill", "#f0f0f0");
    chart.appendChild(bgRect);

    // Actual skill bar
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", xPos);
    bar.setAttribute("y", chartHeight - barHeight);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", barHeight);
    bar.setAttribute("fill", "#4CAF50");
    chart.appendChild(bar);

    // Percentage value on top of bar
    const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
    value.setAttribute("x", xPos + barWidth / 2);
    value.setAttribute("y", chartHeight - barHeight - 5);
    value.setAttribute("text-anchor", "middle");
    value.setAttribute("font-size", "10px");
    value.setAttribute("fill", "#333");
    value.textContent = `${Math.round(skill.amount)}`;
    chart.appendChild(value);
  });

  // Add chart title
  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", chartWidth / 2);
  title.setAttribute("y", -15);
  title.setAttribute("text-anchor", "middle");
  title.setAttribute("font-weight", "bold");
  title.setAttribute("font-size", "12px");
  title.textContent = "Skill Levels";
  chart.appendChild(title);

  if (returnAsString) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  } else {
    const container = document.getElementById('skills-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(svg);
    }
    return null;
  }
}