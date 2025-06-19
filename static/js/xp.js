
export function generateXPLineGraph(data, width = 800, height = 400) {
    const padding = 50;
  
    // Sort by date
    const sorted = data.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
    // Compute cumulative XP
    let totalXP = 0;
    const points = sorted.map(entry => {
      totalXP += entry.amount;
      return {
        date: new Date(entry.createdAt),
        xp: totalXP
      };
    });
    if (!points.length) {
      // Return a placeholder or empty SVG
      return `
        <svg viewBox="0 0 400 200" class="w-full h-full text-gray-400">
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16">
            No XP history available
          </text>
        </svg>
      `;
    }
    // Scaling
    const minDate = points[0].date;
    const maxDate = points[points.length - 1].date;
    const minXP = Math.min(...points.map(p => p.xp));
    const maxXP = Math.max(...points.map(p => p.xp));
  
    const dateToX = (date) =>
      padding + ((date - minDate) / (maxDate - minDate)) * (width - 2 * padding);
    const xpToY = (xp) =>
      height - padding - ((xp - minXP) / (maxXP - minXP)) * (height - 2 * padding);
  
    // Generate path
    const pathData = points.map((p, i) => {
      const x = dateToX(p.date);
      const y = xpToY(p.xp);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  
    // Return full SVG string
    return `
  <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .axis { stroke: #000; stroke-width: 1; }
      .line { fill: none; stroke: blue; stroke-width: 2; }
      .point { fill: red; }
    </style>
    <!-- Axes -->
    <line class="axis" x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" />
    <line class="axis" x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" />
    
    <!-- Line -->
    <path class="line" d="${pathData}" />
    
    <!-- Points -->
    ${points.map(p => {
      const x = dateToX(p.date);
      const y = xpToY(p.xp);
      return `<circle class="point" cx="${x}" cy="${y}" r="2" />`;
    }).join('\n  ')}
  </svg>
    `.trim();
  }
  