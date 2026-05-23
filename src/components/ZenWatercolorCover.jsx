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

    // Determine the specific aesthetic theme based on the story topic
    const getTheme = (id) => {
      if (["r11", "r35"].includes(id)) return "scroll-business"; // Business talks & Contract signing
      if (["r12", "r36"].includes(id)) return "academy-education"; // Interview & University education
      if (["r13", "r34"].includes(id)) return "tea-hospitality"; // Customer service teahouse & Stress relief
      if (["r37"].includes(id)) return "museum-cyber"; // Network tech & Traditional museums
      if (["r38"].includes(id)) return "harmony-river"; // Art of workplace communication
      
      // Fallbacks / other levels
      if (["r8"].includes(id)) return "scroll-business"; // Work productivity
      if (["r18"].includes(id)) return "academy-education"; // Future career path / gates
      if (["r32"].includes(id)) return "harmony-river"; // Environmental harmony
      
      return "zen-landscape"; // General nature fallback
    };

    const theme = getTheme(storyId);

    // --- Curated Hues and Background Color Washes ---
    const getThemeColors = (th) => {
      switch (th) {
        case "tea-hospitality":
          return {
            bg: ["#fdfbf7", "#f3ecd8"],
            ink: "rgba(90, 70, 50, 0.85)",
            accent: "rgba(85, 107, 47, 0.65)", // Sage tea green
            sun: "rgba(189, 41, 33, 0.45)"
          };
        case "scroll-business":
          return {
            bg: ["#faf7f0", "#ece5d3"],
            ink: "rgba(45, 45, 45, 0.9)",
            accent: "rgba(139, 69, 19, 0.5)", // Warm wood brown
            sun: "rgba(189, 41, 33, 0.4)"
          };
        case "academy-education":
          return {
            bg: ["#f7f7f5", "#e4e4e0"],
            ink: "rgba(35, 35, 35, 0.9)",
            accent: "rgba(70, 90, 110, 0.6)", // Scholar slate blue
            sun: "rgba(196, 95, 80, 0.5)"
          };
        case "museum-cyber":
          return {
            bg: ["#141722", "#0d0f16"], // Mysterious dark museum background
            ink: "rgba(220, 220, 220, 0.9)",
            accent: "rgba(0, 191, 255, 0.75)", // Glowing cyan cyber lasers
            sun: "rgba(255, 255, 255, 0.15)"
          };
        case "harmony-river":
          return {
            bg: ["#f2f6f3", "#dae5df"],
            ink: "rgba(30, 48, 40, 0.85)",
            accent: "rgba(55, 95, 75, 0.6)", // Teal wash
            sun: "rgba(189, 41, 33, 0.45)"
          };
        default: // zen-landscape
          return {
            bg: ["#f6f5f2", "#e5e4e0"],
            ink: "rgba(40, 40, 40, 0.85)",
            accent: "rgba(70, 70, 70, 0.4)",
            sun: "rgba(189, 41, 33, 0.45)"
          };
      }
    };

    const colors = getThemeColors(theme);

    // 1. Paint Background Paper Wash
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, colors.bg[0]);
    bgGrad.addColorStop(1, colors.bg[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Apply rice paper subtle texture noise
    ctx.fillStyle = theme === "museum-cyber" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)";
    for (let i = 0; i < 3000; i++) {
      const px = random() * width;
      const py = random() * height;
      const size = random() * 2 + 0.5;
      ctx.fillRect(px, py, size, size);
    }

    // --- THEME SPECIFIC PROCEDURAL DRAWING ---
    switch (theme) {
      case "tea-hospitality":
        drawTeaHospitalityTheme(ctx, width, height, colors, random);
        break;
      case "scroll-business":
        drawScrollBusinessTheme(ctx, width, height, colors, random);
        break;
      case "academy-education":
        drawAcademyEducationTheme(ctx, width, height, colors, random);
        break;
      case "museum-cyber":
        drawMuseumCyberTheme(ctx, width, height, colors, random);
        break;
      case "harmony-river":
        drawHarmonyRiverTheme(ctx, width, height, colors, random);
        break;
      default:
        drawZenLandscapeTheme(ctx, width, height, colors, random);
    }

    // Always overlay a gorgeous classical red calligraphy seal
    drawArtistSeal(ctx, width - 60, 40, level, theme === "museum-cyber");

  }, [storyId, title, level]);

  // ==================== THEMATIC DRAWING FUNCTIONS ====================

  // Theme 1: Tea Hospitality & Cozy Relaxation (r13, r34)
  const drawTeaHospitalityTheme = (ctx, w, h, colors, random) => {
    // Faint circle background representing window
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.45, 90, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fill();

    // Table line
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.lineTo(w, h * 0.8);
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Yixing Teapot silhouette (center-right)
    const potX = w * 0.48;
    const potY = h * 0.8;
    ctx.fillStyle = colors.ink;
    ctx.beginPath();
    // Body
    ctx.ellipse(potX, potY - 20, 32, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lid knob
    ctx.beginPath();
    ctx.arc(potX, potY - 44, 4, 0, Math.PI * 2);
    ctx.fill();
    // Spout
    ctx.beginPath();
    ctx.moveTo(potX - 30, potY - 25);
    ctx.quadraticCurveTo(potX - 52, potY - 38, potX - 50, potY - 42);
    ctx.quadraticCurveTo(potX - 44, potY - 30, potX - 28, potY - 18);
    ctx.closePath();
    ctx.fill();
    // Handle
    ctx.beginPath();
    ctx.arc(potX + 32, potY - 20, 16, -Math.PI/2, Math.PI/2);
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Steaming tea cup (center-left)
    const cupX = w * 0.32;
    const cupY = h * 0.8;
    ctx.beginPath();
    ctx.moveTo(cupX - 16, cupY - 18);
    ctx.lineTo(cupX + 16, cupY - 18);
    ctx.quadraticCurveTo(cupX + 14, cupY, cupX, cupY);
    ctx.quadraticCurveTo(cupX - 14, cupY, cupX - 16, cupY - 18);
    ctx.closePath();
    ctx.fillStyle = colors.ink;
    ctx.fill();

    // Procedural Steam waves
    ctx.strokeStyle = "rgba(100, 80, 60, 0.4)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const sx = cupX - 6 + i * 6;
      ctx.beginPath();
      ctx.moveTo(sx, cupY - 24);
      ctx.bezierCurveTo(
        sx - 4 + random() * 4, cupY - 38,
        sx + 4 - random() * 4, cupY - 52,
        sx + (random() - 0.5) * 6, cupY - 68
      );
      ctx.stroke();
    }

    // Bamboo Leaves in soft sage-green washing hanging down
    drawBambooSprig(ctx, w * 0.15, 20, 35, colors.accent, random);
    drawBambooSprig(ctx, w * 0.8, 10, 45, colors.accent, random);
  };

  // Theme 2: Calligraphy Scroll & Business Contracts (r11, r35, r8)
  const drawScrollBusinessTheme = (ctx, w, h, colors, random) => {
    // Draw an elegant open scroll across the canvas
    const scrollX = w * 0.15;
    const scrollY = h * 0.2;
    const scrollW = w * 0.7;
    const scrollH = h * 0.55;

    // Scroll Background
    ctx.fillStyle = "#faf5e8";
    ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
    ctx.shadowBlur = 10;
    ctx.fillRect(scrollX, scrollY, scrollW, scrollH);
    ctx.shadowBlur = 0; // reset

    // Scroll Borders
    ctx.strokeStyle = "rgba(139, 69, 19, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(scrollX, scrollY, scrollW, scrollH);

    // Scroll Rollers
    ctx.fillStyle = "#5c3a21"; // Dark wood
    ctx.fillRect(scrollX - 8, scrollY - 6, 8, scrollH + 12);
    ctx.fillRect(scrollX + scrollW, scrollY - 6, 8, scrollH + 12);

    // Ancient script line guides (vertical or horizontal columns)
    ctx.strokeStyle = "rgba(189, 41, 33, 0.15)";
    ctx.lineWidth = 1;
    const cols = 12;
    const colStep = scrollW / (cols + 1);
    for (let i = 1; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(scrollX + i * colStep, scrollY + 10);
      ctx.lineTo(scrollX + i * colStep, scrollY + scrollH - 10);
      ctx.stroke();
    }

    // Faint ancient calligraphy marks
    ctx.fillStyle = "rgba(45, 45, 45, 0.35)";
    ctx.font = "10px serif";
    for (let i = 1; i <= cols; i++) {
      const cx = scrollX + i * colStep - 3;
      const charsCount = 3 + Math.floor(random() * 4);
      for (let j = 0; j < charsCount; j++) {
        ctx.fillText("王", cx, scrollY + 20 + j * 20 + (random() - 0.5) * 5);
      }
    }

    // Calligraphy writing brush (maobi) laying diagonally
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.85);
    ctx.lineTo(w * 0.85, h * 0.5);
    ctx.stroke();
    // Brush tip
    ctx.fillStyle = "rgba(20, 20, 20, 0.95)";
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.85);
    ctx.quadraticCurveTo(w * 0.7, h * 0.87, w * 0.69, h * 0.9);
    ctx.quadraticCurveTo(w * 0.71, h * 0.88, w * 0.73, h * 0.86);
    ctx.closePath();
    ctx.fill();

    // Red contract seal directly stamped on the scroll
    drawContractSeal(ctx, scrollX + scrollW - 50, scrollY + scrollH - 35);
  };

  // Theme 3: Academy Portal & Educational Achievements (r12, r36, r18)
  const drawAcademyEducationTheme = (ctx, w, h, colors, random) => {
    // Misty mountains far in the background
    drawMountainLayer(ctx, w, h, 0.45, 0.7, "rgba(70, 90, 110, 0.12)", 4, 25, random);
    drawMountainLayer(ctx, w, h, 0.6, 0.82, "rgba(70, 90, 110, 0.25)", 5, 12, random);

    // Traditional Academy Gate (Paifang) silhouette
    const gateX = w * 0.5;
    const gateY = h * 0.8;
    ctx.fillStyle = colors.ink;
    ctx.fillRect(gateX - 50, gateY - 80, 6, 80); // Left Pillar
    ctx.fillRect(gateX + 44, gateY - 80, 6, 80); // Right Pillar

    // Main roof base beams
    ctx.fillRect(gateX - 60, gateY - 76, 120, 8);
    // Double tier upturned curved roof
    ctx.beginPath();
    ctx.moveTo(gateX - 68, gateY - 82);
    ctx.quadraticCurveTo(gateX - 40, gateY - 96, gateX, gateY - 96);
    ctx.quadraticCurveTo(gateX + 40, gateY - 96, gateX + 68, gateY - 82);
    ctx.lineTo(gateX + 60, gateY - 78);
    ctx.quadraticCurveTo(gateX, gateY - 88, gateX - 60, gateY - 78);
    ctx.closePath();
    ctx.fill();

    // Stone Steps winding down
    ctx.strokeStyle = "rgba(40, 40, 40, 0.5)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const stepY = gateY + i * 8;
      const stepW = 80 + i * 20;
      ctx.beginPath();
      ctx.moveTo(gateX - stepW / 2, stepY);
      ctx.lineTo(gateX + stepW / 2, stepY);
      ctx.stroke();
    }

    // Elegant bamboo forest stalks at sides
    drawTallBamboo(ctx, w * 0.15, h, 80, colors.accent, random);
    drawTallBamboo(ctx, w * 0.82, h, 100, colors.accent, random);
  };

  // Theme 4: Ancient Relics & Cyber Museum (r37)
  const drawMuseumCyberTheme = (ctx, w, h, colors, random) => {
    // Faint grid background
    ctx.strokeStyle = "rgba(0, 191, 255, 0.04)";
    ctx.lineWidth = 1;
    const gridStep = 40;
    for (let x = 0; x < w; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Majestic Bronze Tripod (Ding 鼎) silhouette in dark charcoal ink (center-left)
    const dingX = w * 0.35;
    const dingY = h * 0.8;
    ctx.fillStyle = "rgba(240, 240, 240, 0.9)";
    ctx.beginPath();
    // Body bowl
    ctx.ellipse(dingX, dingY - 45, 45, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    // Left handle
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(240, 240, 240, 0.9)";
    ctx.beginPath();
    ctx.arc(dingX - 45, dingY - 60, 10, Math.PI, Math.PI*1.8);
    ctx.stroke();
    // Right handle
    ctx.beginPath();
    ctx.arc(dingX + 45, dingY - 60, 10, -Math.PI*0.8, 0);
    ctx.stroke();
    // 3 Legs (Tripod)
    ctx.fillRect(dingX - 35, dingY - 20, 8, 30);
    ctx.fillRect(dingX + 27, dingY - 20, 8, 30);
    ctx.fillRect(dingX - 4, dingY - 20, 8, 26);

    // Cyber-blue glowing data streams & digital waves wrapping around
    ctx.strokeStyle = colors.accent;
    ctx.shadowColor = colors.accent;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;

    // Orbit rings
    ctx.beginPath();
    ctx.ellipse(dingX, dingY - 45, 90, 25, -Math.PI / 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(dingX, dingY - 45, 110, 35, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    // Data stream lines
    ctx.beginPath();
    ctx.moveTo(dingX + 120, dingY - 45);
    ctx.lineTo(w * 0.8, h * 0.2);
    ctx.lineTo(w * 0.9, h * 0.2);
    ctx.stroke();

    // Glowing particles
    ctx.fillStyle = "rgba(0, 191, 255, 0.8)";
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const px = dingX + 50 + random() * 180;
      const py = h * 0.15 + random() * h * 0.6;
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0; // reset
  };

  // Theme 5: Merging Rivers & Harmonious Cranes (r38, r32)
  const drawHarmonyRiverTheme = (ctx, w, h, colors, random) => {
    // Two soft blue-grey rivers merging into one
    ctx.fillStyle = colors.accent;
    
    // Top River path
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    ctx.bezierCurveTo(w * 0.25, h * 0.22, w * 0.45, h * 0.4, w * 0.6, h * 0.5);
    ctx.lineTo(w * 0.6, h * 0.7);
    ctx.bezierCurveTo(w * 0.45, h * 0.6, w * 0.25, h * 0.4, 0, h * 0.4);
    ctx.closePath();
    ctx.fill();

    // Bottom River path
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.bezierCurveTo(w * 0.25, h * 0.58, w * 0.45, h * 0.5, w * 0.6, h * 0.5);
    ctx.lineTo(w * 0.6, h * 0.7);
    ctx.bezierCurveTo(w * 0.45, h * 0.7, w * 0.25, h * 0.8, 0, h * 0.8);
    ctx.closePath();
    ctx.fill();

    // Merged main river flowing to the right
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.5);
    ctx.bezierCurveTo(w * 0.75, h * 0.5, w * 0.9, h * 0.45, w, h * 0.45);
    ctx.lineTo(w, h * 0.75);
    ctx.bezierCurveTo(w * 0.9, h * 0.75, w * 0.75, h * 0.7, w * 0.6, h * 0.7);
    ctx.closePath();
    ctx.fill();

    // Weeping willow branches hanging from the top
    ctx.strokeStyle = "rgba(46, 82, 60, 0.45)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) {
      const wx = w * 0.1 + i * w * 0.15;
      ctx.beginPath();
      ctx.moveTo(wx, 0);
      ctx.quadraticCurveTo(wx + 10, h * 0.3, wx - 15, h * 0.6);
      ctx.stroke();
    }

    // Two cranes flying together in perfect symmetry
    drawCrane(ctx, w * 0.5, h * 0.25, 12);
    drawCrane(ctx, w * 0.58, h * 0.35, 10);
  };

  // General Zen Landscape (Fallback for other levels)
  const drawZenLandscapeTheme = (ctx, w, h, colors, random) => {
    drawMountainLayer(ctx, w, h, 0.35, 0.6, "rgba(50, 50, 50, 0.12)", 4, 30, random);
    drawMountainLayer(ctx, w, h, 0.5, 0.78, "rgba(35, 35, 35, 0.3)", 5, 20, random);

    // Draw small wooden boat
    const boatX = w * 0.32;
    const boatY = h * 0.75;
    drawZenBoat(ctx, boatX, boatY);

    drawMountainLayer(ctx, w, h, 0.7, 0.9, "rgba(20, 20, 20, 0.65)", 6, 12, random);

    // Gnarled pine tree branch
    drawZenBranches(ctx, 0, h * 0.2, true, random);
    // Birds
    drawBirds(ctx, w, h, random);
  };

  // ==================== REUSABLE PROCEDURAL HELPERS ====================

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
  };

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

    // Strawhat fisherman
    ctx.beginPath();
    ctx.arc(x + 12, y - 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(40, 40, 40, 0.9)";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 2);
    ctx.lineTo(x + 16, y - 2);
    ctx.lineTo(x + 12, y - 5);
    ctx.closePath();
    ctx.fillStyle = "rgba(60, 60, 60, 0.9)";
    ctx.fill();
  };

  const drawZenBranches = (ctx, startX, startY, isLeft, random) => {
    ctx.strokeStyle = "rgba(25, 25, 25, 0.85)";
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

  const drawBirds = (ctx, w, h, random) => {
    const birdsCount = 3 + Math.floor(random() * 3);
    ctx.strokeStyle = "rgba(40, 40, 40, 0.55)";
    ctx.lineWidth = 1;

    for (let i = 0; i < birdsCount; i++) {
      const bx = w * 0.2 + random() * w * 0.5;
      const by = h * 0.15 + random() * h * 0.3;
      const size = 6 + random() * 5;

      ctx.beginPath();
      ctx.moveTo(bx - size, by);
      ctx.quadraticCurveTo(bx - size * 0.5, by - size * 0.6, bx, by);
      ctx.quadraticCurveTo(bx + size * 0.5, by - size * 0.6, bx + size, by);
      ctx.stroke();
    }
  };

  const drawBambooSprig = (ctx, x, y, len, color, random) => {
    ctx.strokeStyle = "rgba(30, 45, 35, 0.8)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 10, y + len * 0.5, x - 5, y + len);
    ctx.stroke();

    // Draw long sharp bamboo leaves
    ctx.fillStyle = color;
    for (let i = 0; i < 4; i++) {
      const lx = x - 5 + (random() - 0.5) * 10;
      const ly = y + len * 0.5 + i * 12;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.quadraticCurveTo(lx - 25, ly + 10, lx - 40, ly + 35);
      ctx.quadraticCurveTo(lx - 15, ly + 25, lx, ly + 5);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawTallBamboo = (ctx, x, startY, height, color, random) => {
    ctx.strokeStyle = "rgba(45, 60, 50, 0.9)";
    ctx.lineWidth = 4;
    ctx.lineCap = "butt";

    // Segmented bamboo stalk
    const segments = 4;
    const segH = height / segments;
    for (let i = 0; i < segments; i++) {
      const cy = startY - i * segH;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, cy - segH + 2);
      ctx.stroke();

      // Node ring
      ctx.strokeStyle = "rgba(25, 35, 25, 0.95)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 4, cy - segH + 1);
      ctx.lineTo(x + 4, cy - segH + 1);
      ctx.stroke();
      ctx.strokeStyle = "rgba(45, 60, 50, 0.9)";
      ctx.lineWidth = 4;
    }

    // Branch sprigs
    drawBambooLeaves(ctx, x - 2, startY - height * 0.7, -15, color, random);
    drawBambooLeaves(ctx, x + 2, startY - height * 0.4, 15, color, random);
  };

  const drawBambooLeaves = (ctx, x, y, angleDeg, color, random) => {
    ctx.fillStyle = color;
    const rad = angleDeg * Math.PI / 180;
    
    for (let i = 0; i < 3; i++) {
      const curRad = rad + (i - 1) * 0.25;
      const lx = x + Math.cos(curRad) * 10;
      const ly = y + Math.sin(curRad) * 10;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(lx + Math.cos(curRad)*20, ly + Math.sin(curRad)*20, lx + Math.cos(curRad)*35, ly + Math.sin(curRad)*35);
      ctx.quadraticCurveTo(lx + Math.cos(curRad)*22, ly + Math.sin(curRad)*22, x, y);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawCrane = (ctx, x, y, size) => {
    ctx.strokeStyle = "rgba(30, 30, 30, 0.75)";
    ctx.lineWidth = 1.2;
    ctx.fillStyle = "rgba(245, 245, 245, 0.9)";

    ctx.beginPath();
    // Left Wing
    ctx.moveTo(x - size, y - size * 0.2);
    ctx.quadraticCurveTo(x - size * 0.3, y - size * 0.9, x, y);
    // Right Wing
    ctx.quadraticCurveTo(x + size * 0.3, y - size * 0.9, x + size, y - size * 0.2);
    // Body & Head
    ctx.lineTo(x + size * 0.2, y + size * 0.2);
    ctx.quadraticCurveTo(x, y + size * 0.6, x - size * 0.1, y + size * 0.8); // neck
    ctx.lineTo(x - size * 0.2, y + size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawContractSeal = (ctx, x, y) => {
    const size = 30;
    ctx.fillStyle = "rgba(189, 41, 33, 0.85)";
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x - size/2 + 2, y - size/2 + 2, size - 4, size - 4);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("合", x - 5, y - 5);
    ctx.fillText("同", x + 5, y - 5);
    ctx.fillText("之", x - 5, y + 5);
    ctx.fillText("印", x + 5, y + 5);
  };

  const drawArtistSeal = (ctx, x, y, level, isDarkTheme) => {
    const sealSize = 26;
    ctx.fillStyle = isDarkTheme ? "rgba(224, 60, 50, 0.95)" : "rgba(189, 41, 33, 0.9)";
    ctx.fillRect(x - sealSize / 2, y - sealSize / 2, sealSize, sealSize);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - sealSize / 2 + 2, y - sealSize / 2 + 2, sealSize - 4, sealSize - 4);

    const levelChars = ["一", "二", "三", "四", "五", "六"];
    const char = levelChars[level - 1] || "印";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, x, y);
  };
}
