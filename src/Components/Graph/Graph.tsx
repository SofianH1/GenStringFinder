import React, { useRef, useEffect } from "react";
import p5Type from "p5";

interface GraphProps {
  data: number[];
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5Type | null>(null);

  const sketch = (p5: p5Type) => {
    p5.setup = () => {
      p5.createCanvas(600, 400);
    };

    p5.draw = () => {
      const margin = 60;
      p5.background(36,36,36);

      const displayData = data.slice(-(1000));
      
      if (displayData.length === 0) {
        p5.fill(150);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("No data", p5.width / 2, p5.height / 2);
        return;
      }

      const maxData = Math.max(...displayData);
      const minData = Math.min(...displayData);
      const rangeY = maxData - minData || 100;
      const w = p5.width - 2 * margin;
      const h = p5.height - 2 * margin;

      p5.stroke(200);
      p5.line(margin, margin, margin, p5.height - margin); // Y
      p5.line(margin, p5.height - margin, p5.width - margin, p5.height - margin); // X

      p5.noStroke();
      p5.fill(100);
      p5.textSize(12);
      p5.textAlign(p5.CENTER);
      p5.text("generations", p5.width / 2, p5.height - 10);
      p5.textAlign(p5.RIGHT);
      p5.text("Fitness (↓)", margin - 5, p5.height / 2);

      p5.stroke(0, 128, 128);
      p5.strokeWeight(4);
      p5.strokeJoin(p5.ROUND);
      p5.noFill();
      p5.beginShape();

      displayData.forEach((value, i) => {
        const x = margin + (i / (displayData.length - 1)) * w;
        const y = p5.map(value, minData, maxData, p5.height - margin, margin);
        p5.vertex(x, y);
      });

      p5.endShape();

      p5.fill(0, 128, 128);
      p5.noStroke();
      const recentData = displayData.slice(-5);
      recentData.forEach((value, i) => {
        const idx = displayData.length - recentData.length + i;
        const x = margin + (idx / (displayData.length - 1)) * w;
        const y = p5.map(value, minData, maxData, p5.height - margin, margin);
        p5.circle(x, y, 8);
      });

      p5.fill(100);
      p5.textAlign(p5.LEFT);
      
    };
  };

  useEffect(() => {
    if (p5Instance.current) p5Instance.current.remove();
    p5Instance.current = new p5Type(sketch, sketchRef.current!);
    return () => p5Instance.current?.remove();
  }, [data]);

  return (
    <div ref={sketchRef} id="graph"/>
  );
};

export default Graph;
