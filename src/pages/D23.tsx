import { Graph } from '@dagrejs/graphlib';
import fullData from '../assets/inputs/D23-input.txt?raw';
import sampleData from '../assets/inputs/D23-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): Graph {
  // Create a new directed graph that allows parallel edges
  const graph = new Graph({ directed: false, multigraph: true });

  // Split input into lines and process each edge
  data
    .trim()
    .split('\n')
    .forEach((line) => {
      const [node1, node2] = line.split('-');

      // Add nodes if they don't exist
      if (!graph.hasNode(node1)) graph.setNode(node1);
      if (!graph.hasNode(node2)) graph.setNode(node2);

      // Add edge (the library handles bidirectional automatically since directed: false)
      graph.setEdge(node1, node2);
    });
  console.log(graph.nodes());

  return graph;
}

function D23P1(data: Graph): { result: number; timing: number } {
  const start = performance.now();
  const cliques = new Set<string>();

  // For each node
  data.nodes().forEach((node1) => {
    const neighbors = data.neighbors(node1) || [];

    // For each pair of neighbors
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        // If these neighbors are connected, we found a triangle
        if (data.hasEdge(neighbors[i], neighbors[j])) {
          // Sort nodes to ensure consistent key regardless of traversal order
          const cliqueKey = [node1, neighbors[i], neighbors[j]].sort().join(',');
          cliques.add(cliqueKey);
        }
      }
    }
  });

  // Count cliques containing at least one node starting with 't'
  const cliquesWithT = Array.from(cliques).filter((clique) => {
    const nodes = clique.split(',');
    return nodes.some((node) => node.startsWith('t'));
  });

  const result = cliquesWithT.length;
  const timing = performance.now() - start;
  return { timing, result };
}

function findMaxClique(graph: Graph): string[] {
  let maxClique: string[] = [];

  function bronKerbosch(r: string[], p: string[], x: string[]) {
    if (p.length === 0 && x.length === 0) {
      if (r.length > maxClique.length) {
        maxClique = [...r];
      }
      return;
    }

    const pCopy = [...p];

    for (const v of pCopy) {
      const neighbors = graph.neighbors(v) || [];
      bronKerbosch(
        [...r, v],
        p.filter((n) => neighbors.includes(n)),
        x.filter((n) => neighbors.includes(n)),
      );
      p = p.filter((n) => n !== v);
      x = [...x, v];
    }
  }

  bronKerbosch([], graph.nodes(), []);
  return maxClique;
}

function D23P2(data: Graph): { result: string; timing: number } {
  const start = performance.now();

  const maxClique = findMaxClique(data);
  const password = maxClique.sort().join(',');
  console.log('Password:', password);

  const timing = performance.now() - start;
  return { timing, result: password };
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D23P1(data);
  const response2 = D23P2(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
    </>
  );
}
