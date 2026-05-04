import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import data from './data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/impact', (req, res) => {
  const categories = data.categories.map((category) => {
    const items = data.projects.filter((project) => project.category === category.id);
    const totalFunding = items.reduce((sum, project) => sum + project.funding, 0);
    const totalImpact = items.reduce((sum, project) => sum + project.impact, 0);
    const efficiency = totalFunding ? (totalImpact / totalFunding) * 10000 : 0;
    return {
      ...category,
      totalFunding,
      totalImpact,
      efficiency: Number(efficiency.toFixed(2)),
      projects: items
    };
  });

  const ranking = [...categories].sort((a, b) => b.efficiency - a.efficiency);

  res.json({ categories, ranking, overview: data.overview });
});

app.get('/api/overview', (req, res) => {
  res.json(data.overview);
});

const frontendDist = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Green Bond Impact Reporter API listening on http://localhost:${PORT}`);
});
