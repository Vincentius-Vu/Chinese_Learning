import React, { useEffect, useRef } from "react";

export default function ZenWatercolorCover({ storyId, title, level }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 800;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // --- Deterministic Pseudo-Random Number Generator (PRNG) ---
    const getSeed = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const seed = getSeed(storyId + title);
    let currentSeed = seed;
    const random = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    // --- Select Curated Zen Hues based on Seed ---
    const palettes = [
      // Misty Jade / Emerald Forest
      {
        bg: ["#f2f5f3", "#dbe6df"],
        mountains: ["rgba(47, 72, 60, 0.15)", "rgba(38, 61, 50, 0.35)", "rgba(25, 43, 35, 0.65)"],
        sun: "rgba(196, 95, 80, 0.45)",
        highlight: "#427d63"
      },
      // Traditional Ink Charcoal / Zen Grey
      {
        bg: ["#f6f5f2", "#e5e4e0"],
        mountains: ["rgba(60, 60, 60, 0.15)", "rgba(45, 45, 45, 0.35)", "rgba(20, 20, 20, 0.7)"],
        sun: "rgba(178, 58, 48, 0.5)",
        highlight: "#3c3c3c"
      },
      // Warm Sepia / Golden Mist
      {
        bg: ["#fdfbf7", "#eedfca"],
        mountains: ["rgba(139, 115, 85, 0.15)", "rgba(110, 88, 62, 0.35)", "rgba(74, 53, 30, 0.7)"],
        sun: "rgba(204, 85, 0, 0.45)",
        highlight: "#8b5a2b"
      },
      // Deep Indigo / Midnight Lake
      {
        bg: ["#f0f2f6", "#cad3e0"],
        mountains: ["rgba(49, 62, 82, 0.15)", "rgba(35, 47, 66, 0.35)", "rgba(18, 27, 41, 0.7)"],
        sun: "rgba(224, 110, 95, 0.45)",
        highlight: "#2e3b4e"
      }
    ];

    const palette = palettes[seed % palettes.length];

    // Clear Canvas and paint background paper wash
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, palette.bg[0]);
    bgGrad.addColorStop(1, palette.bg[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Apply rice paper subtle texture noise
    ctx.fillStyle = "rgba(0,0,0,0.015)";
    for (let i = 0; i < 3000; i++) {
      const px = random() * width;
      const py = random() * height;
      const size = random() * 2 + 0.5;
      ctx.fillRect(px, py, size, size);
    }

    // Draw Zen Sun/Moon
    const sunX = width * 0.7 + random() * width * 0.15;
    const sunY = height * 0.2 + random() * height * 0.15;
    const sunRad = 35 + random() * 15;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRad, 0, Math.PI * 2);
    ctx.fillStyle = palette.sun;
    ctx.fill();

    // Draw Far Mountain Hills (Level 1)
    drawMountainLayer(ctx, width, height, 0.3, 0.6, palette.mountains[0], 4, 30, random);

    // Draw Mid Mountain Hills (Level 2)
    drawMountainLayer(ctx, width, height, 0.5, 0.75, palette.mountains[1], 5, 20, random);

    // Draw a small wooden boat on the lake
    const boatX = width * 0.3 + random() * width * 0.25;
    const boatY = height * 0.75 + random() * height * 0.05;
    drawZenBoat(ctx, boatX, boatY);

    // Draw Near Mountain Hills (Level 3)
    drawMountainLayer(ctx, width, height, 0.7, 0.9, palette.mountains[2], 6, 12, random);

    // Draw Gnarled Pine/Willow branches hanging from the sides
    const leftSide = random() > 0.5;
    drawZenBranches(ctx, leftSide ? 0 : width, height * 0.2, leftSide, random);

    // Draw flying birds/cranes
    drawBirds(ctx, width, height, random);

    // Draw Cinnabar Red Artist Seal stamp
    drawArtistSeal(ctx, width - 60, 40, level);

  }, [storyId, title, level]);

  // Helper: Draw organic mountain silhouette with Bezier curves
  const drawMountainLayer = (ctx, w, h, minHeightFactor, maxHeightFactor, color, pointsCount, roughness, random) => {
    const points = [];
    const step = w / (pointsCount - 1);
    const startY = h * (minHeightFactor + random() * (maxHeightFactor - minHeightFactor));

    points.push({ x: 0, y: startY });
    for (let i = 1; i < pointsCount - 1; i++) {
      const midY = h * (minHeightFactor + random() * (maxHeightFactor - minHeightFactor));
      points.push({
        x: i * step + (random() - 0.5) * (step * 0.3),
        y: midY + (random() - 0.5) * roughness
      });
    }
    points.push({ x: w, y: h * (minHeightFactor + random() * (maxHeightFactor - minHeightFactor)) });

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    // Subtle watercolor wash edge highlight
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Helper: Draw a solitary zen fisherman boat
  const drawZenBoat = (ctx, x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 15, y + 6, x + 35, y); // Hull top
    ctx.lineTo(x + 30, y + 4);
    ctx.lineTo(x + 5, y + 4);
    ctx.closePath();
    ctx.fillStyle = "rgba(40, 40, 40, 0.85)";
    ctx.fill();

    // Mast
    ctx.beginPath();
    ctx.moveTo(x + 20, y);
    ctx.lineTo(x + 20, y - 18);
    ctx.strokeStyle = "rgba(40, 40, 40, 0.9)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tiny straw hat fisherman silhouette
    ctx.beginPath();
    ctx.arc(x + 12, y - 2, 2.5, 0, Math.PI * 2); // Head
    ctx.fillStyle = "rgba(40, 40, 40, 0.9)";
    ctx.fill();
    // Hat
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 2);
    ctx.lineTo(x + 16, y - 2);
    ctx.lineTo(x + 12, y - 5);
    ctx.closePath();
    ctx.fillStyle = "rgba(60, 60, 60, 0.9)";
    ctx.fill();
  };

  // Helper: Draw gnarled traditional branches
  const drawZenBranches = (ctx, startX, startY, isLeft, random) => {
    ctx.strokeStyle = "rgba(25, 25, 25, 0.85)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const drawBranch = (x, y, len, angle, width) => {
      ctx.lineWidth = width;
      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + (endX - x) * 0.5 + (random() - 0.5) * 15,
        y + (endY - y) * 0.5 + (random() - 0.5) * 15,
        endX,
        endY
      );
      ctx.stroke();

      // Leaves / Pine Needles
      if (len < 25) {
        ctx.fillStyle = "rgba(35, 55, 45, 0.75)";
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(
            endX + (random() - 0.5) * 12,
            endY + (random() - 0.5) * 12,
            2.5 + random() * 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      if (len < 10) return;

      const branchesCount = random() > 0.4 ? 2 : 1;
      for (let i = 0; i < branchesCount; i++) {
        const nextAngle = angle + (random() * 0.6 - 0.3) + (isLeft ? 0.15 : -0.15);
        const nextLen = len * (0.65 + random() * 0.2);
        drawBranch(endX, endY, nextLen, nextAngle, width * 0.65);
      }
    };

    const initialAngle = isLeft ? -0.15 + random() * 0.3 : Math.PI + 0.15 - random() * 0.3;
    drawBranch(startX, startY, 60 + random() * 30, initialAngle, 4);
  };

  // Helper: Draw flying birds (cranes)
  const drawBirds = (ctx, w, h, random) => {
    const birdsCount = 3 + Math.floor(random() * 4);
    ctx.strokeStyle = "rgba(40, 40, 40, 0.55)";
    ctx.lineWidth = 1;

    for (let i = 0; i < birdsCount; i++) {
      const bx = w * 0.2 + random() * w * 0.5;
      const by = h * 0.15 + random() * h * 0.3;
      const size = 6 + random() * 5;

      ctx.beginPath();
      // Left wing
      ctx.moveTo(bx - size, by);
      ctx.quadraticCurveTo(bx - size * 0.5, by - size * 0.6, bx, by);
      // Right wing
      ctx.quadraticCurveTo(bx + size * 0.5, by - size * 0.6, bx + size, by);
      ctx.stroke();
    }
  };

  // Helper: Draw Red Calligraphy Artist Seal Stamp
  const drawArtistSeal = (ctx, x, y, level) => {
    const sealSize = 26;
    ctx.fillStyle = "rgba(189, 41, 33, 0.9)"; // Beautiful imperial Chinese red cinnabar
    ctx.fillRect(x - sealSize / 2, y - sealSize / 2, sealSize, sealSize);

    // Inner outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - sealSize / 2 + 2, y - sealSize / 2 + 2, sealSize - 4, sealSize - 4);

    // Level characters
    const levelChars = ["一", "二", "三", "四", "五", "六"];
    const char = levelChars[level - 1] || "印";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        borderRadius: "inherit"
      }}
    />
  );
}
