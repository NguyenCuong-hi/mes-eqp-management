// StepsCell.ts
import { GridCellKind } from "@glideapps/glide-data-grid";

export const StepsCell = {
  kind: GridCellKind.Custom,
  isMatch: (cell) => cell.data?.kind === "steps-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const steps = cell.data.steps ?? [];

    const centerY = rect.y + rect.height / 2;
    const stepRadius = 6;
    const padding = 12;
    const spacing = 60;

    steps.forEach((step, idx) => {
      const cx = rect.x + padding + idx * spacing;

      // Draw connector
      if (idx < steps.length - 1) {
        const nextX = rect.x + padding + (idx + 1) * spacing;
        ctx.strokeStyle = "#d9d9d9";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + stepRadius, centerY);
        ctx.lineTo(nextX - stepRadius, centerY);
        ctx.stroke();
      }

      // Choose color
      let color = "#d9d9d9";
      if (step.status === "finish") color = "#52c41a";
      else if (step.status === "process") color = "#1890ff";
      else if (step.status === "error") color = "#ff4d4f";

      // Draw circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, centerY, stepRadius, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.fillStyle = theme.textDark;
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(step.title ?? "", cx, centerY + 18);
    });

    return true;
  },
  measure: () => 200,
};
