
/**
 * Maximum depth limit for depth-limited search algorithms.
 * Used to prevent infinite recursion in depth-first search variants.
 * @constant {number}
 */
const MAX_DEPTH = 100;

/**
 * Pre-calculated straight-line distances between cities in Romania.
 * These distances represent the "as the crow flies" distance between cities in kilometers.
 * Used as heuristic values for informed search algorithms.
 * 
 * Structure:
 * {
 *   CityName: {
 *     CityName: distance,
 *     ...
 *   },
 *   ...
 * }
 * 
 * Properties:
 * - Symmetric: distance[A][B] = distance[B][A]
 * - Zero diagonal: distance[A][A] = 0
 * - Admissible: distances are underestimates of actual path distances
 * 
 * @constant {Object.<string, Object.<string, number>>}
 */
const cityDistances = {
  Arad: {
    Arad: 0, Bucharest: 366, Craiova: 160, Drobeta: 242, Eforie: 161,
    Fagaras: 176, Giurgiu: 77, Hirsova: 151, Iasi: 226, Lugoj: 244,
    Mehadia: 241, Neamt: 234, Oradea: 380, Pitesti: 100, RimnicuVilcea: 193,
    Sibiu: 253, Timisoara: 329, Urziceni: 80, Vaslui: 199, Zerind: 374
  },
  Bucharest: {
    Arad: 366, Bucharest: 0, Craiova: 160, Drobeta: 242, Eforie: 161,
    Fagaras: 211, Giurgiu: 90, Hirsova: 85, Iasi: 226, Lugoj: 244,
    Mehadia: 241, Neamt: 234, Oradea: 380, Pitesti: 101, RimnicuVilcea: 193,
    Sibiu: 253, Timisoara: 329, Urziceni: 85, Vaslui: 199, Zerind: 374
  },
  Craiova: {
    Arad: 160, Bucharest: 160, Craiova: 0, Drobeta: 120, Eforie: 311,
    Fagaras: 178, Giurgiu: 140, Hirsova: 225, Iasi: 386, Lugoj: 244,
    Mehadia: 241, Neamt: 394, Oradea: 380, Pitesti: 138, RimnicuVilcea: 146,
    Sibiu: 253, Timisoara: 329, Urziceni: 245, Vaslui: 359, Zerind: 374
  },
  Drobeta: {
    Arad: 242, Bucharest: 242, Craiova: 120, Drobeta: 0, Eforie: 431,
    Fagaras: 298, Giurgiu: 222, Hirsova: 345, Iasi: 506, Lugoj: 244,
    Mehadia: 75, Neamt: 514, Oradea: 380, Pitesti: 258, RimnicuVilcea: 266,
    Sibiu: 253, Timisoara: 329, Urziceni: 365, Vaslui: 479, Zerind: 374
  },
  Eforie: {
    Arad: 161, Bucharest: 161, Craiova: 311, Drobeta: 431, Eforie: 0,
    Fagaras: 372, Giurgiu: 251, Hirsova: 86, Iasi: 365, Lugoj: 405,
    Mehadia: 506, Neamt: 395, Oradea: 380, Pitesti: 262, RimnicuVilcea: 354,
    Sibiu: 253, Timisoara: 329, Urziceni: 246, Vaslui: 338, Zerind: 374
  },
  Fagaras: {
    Arad: 176, Bucharest: 211, Craiova: 178, Drobeta: 298, Eforie: 372,
    Fagaras: 0, Giurgiu: 121, Hirsova: 286, Iasi: 447, Lugoj: 420,
    Mehadia: 518, Neamt: 455, Oradea: 380, Pitesti: 110, RimnicuVilcea: 118,
    Sibiu: 99, Timisoara: 329, Urziceni: 296, Vaslui: 410, Zerind: 374
  },
  Giurgiu: {
    Arad: 77, Bucharest: 90, Craiova: 140, Drobeta: 222, Eforie: 251,
    Fagaras: 121, Giurgiu: 0, Hirsova: 175, Iasi: 336, Lugoj: 321,
    Mehadia: 416, Neamt: 344, Oradea: 380, Pitesti: 191, RimnicuVilcea: 199,
    Sibiu: 253, Timisoara: 329, Urziceni: 175, Vaslui: 289, Zerind: 374
  },
  Hirsova: {
    Arad: 151, Bucharest: 85, Craiova: 225, Drobeta: 345, Eforie: 86,
    Fagaras: 286, Giurgiu: 175, Hirsova: 0, Iasi: 279, Lugoj: 319,
    Mehadia: 420, Neamt: 309, Oradea: 380, Pitesti: 176, RimnicuVilcea: 268,
    Sibiu: 253, Timisoara: 329, Urziceni: 160, Vaslui: 252, Zerind: 374
  },
  Iasi: {
    Arad: 226, Bucharest: 226, Craiova: 386, Drobeta: 506, Eforie: 365,
    Fagaras: 447, Giurgiu: 336, Hirsova: 279, Iasi: 0, Lugoj: 485,
    Mehadia: 586, Neamt: 87, Oradea: 380, Pitesti: 285, RimnicuVilcea: 377,
    Sibiu: 253, Timisoara: 329, Urziceni: 439, Vaslui: 92, Zerind: 374
  },
  Lugoj: {
    Arad: 244, Bucharest: 244, Craiova: 244, Drobeta: 244, Eforie: 405,
    Fagaras: 420, Giurgiu: 321, Hirsova: 319, Iasi: 485, Lugoj: 0,
    Mehadia: 70, Neamt: 572, Oradea: 380, Pitesti: 333, RimnicuVilcea: 341,
    Sibiu: 253, Timisoara: 111, Urziceni: 329, Vaslui: 493, Zerind: 374
  },
  Mehadia: {
    Arad: 241, Bucharest: 241, Craiova: 241, Drobeta: 75, Eforie: 506,
    Fagaras: 518, Giurgiu: 416, Hirsova: 420, Iasi: 586, Lugoj: 70,
    Mehadia: 0, Neamt: 642, Oradea: 380, Pitesti: 333, RimnicuVilcea: 341,
    Sibiu: 253, Timisoara: 181, Urziceni: 399, Vaslui: 553, Zerind: 374
  },
  Neamt: {
    Arad: 234, Bucharest: 234, Craiova: 394, Drobeta: 514, Eforie: 395,
    Fagaras: 455, Giurgiu: 344, Hirsova: 309, Iasi: 87, Lugoj: 572,
    Mehadia: 642, Neamt: 0, Oradea: 380, Pitesti: 372, RimnicuVilcea: 464,
    Sibiu: 253, Timisoara: 329, Urziceni: 526, Vaslui: 5, Zerind: 374
  },
  Oradea: {
    Arad: 380, Bucharest: 380, Craiova: 380, Drobeta: 380, Eforie: 380,
    Fagaras: 380, Giurgiu: 380, Hirsova: 380, Iasi: 380, Lugoj: 380,
    Mehadia: 380, Neamt: 380, Oradea: 0, Pitesti: 380, RimnicuVilcea: 380,
    Sibiu: 151, Timisoara: 380, Urziceni: 380, Vaslui: 380, Zerind: 71
  },
  Pitesti: {
    Arad: 100, Bucharest: 101, Craiova: 138, Drobeta: 258, Eforie: 262,
    Fagaras: 110, Giurgiu: 191, Hirsova: 176, Iasi: 285, Lugoj: 333,
    Mehadia: 333, Neamt: 372, Oradea: 380, Pitesti: 0, RimnicuVilcea: 97,
    Sibiu: 253, Timisoara: 329, Urziceni: 186, Vaslui: 300, Zerind: 374
  },
  RimnicuVilcea: {
    Arad: 193, Bucharest: 193, Craiova: 146, Drobeta: 266, Eforie: 354,
    Fagaras: 118, Giurgiu: 199, Hirsova: 268, Iasi: 377, Lugoj: 341,
    Mehadia: 341, Neamt: 464, Oradea: 380, Pitesti: 97, RimnicuVilcea: 0,
    Sibiu: 80, Timisoara: 329, Urziceni: 283, Vaslui: 397, Zerind: 374
  },
  Sibiu: {
    Arad: 253, Bucharest: 253, Craiova: 253, Drobeta: 253, Eforie: 253,
    Fagaras: 99, Giurgiu: 253, Hirsova: 253, Iasi: 253, Lugoj: 253,
    Mehadia: 253, Neamt: 253, Oradea: 151, Pitesti: 253, RimnicuVilcea: 80,
    Sibiu: 0, Timisoara: 329, Urziceni: 253, Vaslui: 253, Zerind: 374
  },
  Timisoara: {
    Arad: 329, Bucharest: 329, Craiova: 329, Drobeta: 329, Eforie: 329,
    Fagaras: 329, Giurgiu: 329, Hirsova: 329, Iasi: 329, Lugoj: 111,
    Mehadia: 181, Neamt: 329, Oradea: 380, Pitesti: 329, RimnicuVilcea: 329,
    Sibiu: 253, Timisoara: 0, Urziceni: 329, Vaslui: 329, Zerind: 374
  },
  Urziceni: {
    Arad: 80, Bucharest: 85, Craiova: 245, Drobeta: 365, Eforie: 246,
    Fagaras: 296, Giurgiu: 175, Hirsova: 160, Iasi: 439, Lugoj: 329,
    Mehadia: 399, Neamt: 526, Oradea: 380, Pitesti: 186, RimnicuVilcea: 283,
    Sibiu: 253, Timisoara: 329, Urziceni: 0, Vaslui: 92, Zerind: 374
  },
  Vaslui: {
    Arad: 199, Bucharest: 199, Craiova: 359, Drobeta: 479, Eforie: 338,
    Fagaras: 410, Giurgiu: 289, Hirsova: 252, Iasi: 92, Lugoj: 493,
    Mehadia: 553, Neamt: 5, Oradea: 380, Pitesti: 300, RimnicuVilcea: 397,
    Sibiu: 253, Timisoara: 329, Urziceni: 92, Vaslui: 0, Zerind: 374
  },
  Zerind: {
    Arad: 374, Bucharest: 374, Craiova: 374, Drobeta: 374, Eforie: 374,
    Fagaras: 374, Giurgiu: 374, Hirsova: 374, Iasi: 374, Lugoj: 374,
    Mehadia: 374, Neamt: 374, Oradea: 71, Pitesti: 374, RimnicuVilcea: 374,
    Sibiu: 253, Timisoara: 374, Urziceni: 374, Vaslui: 374, Zerind: 0
  }
};

/**
 * Graph representation of the Romania map.
 * Each city is a node, and roads between cities are edges with distances.
 * 
 * Structure:
 * {
 *   CityName: {
 *     NeighborCity: distance,
 *     ...
 *   },
 *   ...
 * }
 * 
 * Properties:
 * - Undirected: if A connects to B, B connects to A
 * - Weighted: edges have distances in kilometers
 * - Connected: all cities are reachable from any other city
 * 
 * @constant {Object.<string, Object.<string, number>>}
 */
const graph = {
  Arad: { Zerind: 75, Sibiu: 140, Timisoara: 118 },
  Zerind: { Arad: 75, Oradea: 71 },
  Oradea: { Zerind: 71, Sibiu: 151 },
  Sibiu: { Arad: 140, Oradea: 151, Fagaras: 99, RimnicuVilcea: 80 },
  Timisoara: { Arad: 118, Lugoj: 111 },
  Lugoj: { Timisoara: 111, Mehadia: 70 },
  Mehadia: { Lugoj: 70, Drobeta: 75 },
  Drobeta: { Mehadia: 75, Craiova: 120 },
  Craiova: { Drobeta: 120, RimnicuVilcea: 146, Pitesti: 138 },
  RimnicuVilcea: { Sibiu: 80, Craiova: 146, Pitesti: 97 },
  Fagaras: { Sibiu: 99, Bucharest: 211 },
  Pitesti: { RimnicuVilcea: 97, Craiova: 138, Bucharest: 101 },
  Bucharest: { Fagaras: 211, Pitesti: 101, Giurgiu: 90, Urziceni: 85 },
  Giurgiu: { Bucharest: 90 },
  Urziceni: { Bucharest: 85, Hirsova: 98, Vaslui: 142 },
  Hirsova: { Urziceni: 98, Eforie: 86 },
  Eforie: { Hirsova: 86 },
  Vaslui: { Urziceni: 142, Iasi: 92 },
  Iasi: { Vaslui: 92, Neamt: 87 },
  Neamt: { Iasi: 87 }
};

/**
 * Calculates the total distance of a path through the graph.
 * 
 * @param {Array} path - The path through the graph, represented as an array of city names.
 * @returns {number} The total distance of the path.
 */
function calculatePathDistance(path) {
  if (!path || path.length < 2) return 0;
  
  let totalCost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];
    totalCost += graph[current][next];
  }
  return totalCost;
}

/**
 *  List of algorithms (Blind Search)
 *  Breadth-First Search - BFS - OK
 *  Uniform Cost Search - UCS - OK
 *  Depth-First Search - DFS - OK
 *  Limited Depth-First Search - LDFS - OK
 *  Iterative Deepening Depth-First Search - IDDFS - OK
 *  Bidirectional Search - OK
 */

function bfs(graph, start, goal) {
  const queue = [[start]];
  const visited = new Set();

  while(queue.length) {
    let path = queue.shift();
    let city = path[path.length - 1];

    if(city === goal) return path;

    if(!visited.has(city)) { 
      visited.add(city);

      for(let neighbor in graph[city]) {
        if(!visited.has(neighbor)) {
          let newPath = [...path, neighbor];
          queue.push(newPath);
        } 
      }
    }
  }
}

function ucs(graph, start, goal) {
  let priorityQueue = [{ path: [start], cost: 0 }];
  let visited = new Map();

  while(priorityQueue.length) { 
    priorityQueue.sort((a, b) => a.cost - b.cost);
    let { path, cost } = priorityQueue.shift();
    let city = path[path.length - 1];

    if(city === goal) {
      return path;
    }

    if(visited.has(city) && visited.get(city) <= cost) {
      continue;
    }

    for (let neighbor in graph[city]) {
      let newCost = cost + graph[city][neighbor];
      let newPath = [...path, neighbor];
      priorityQueue.push({ path: newPath, cost: newCost });
    }
  }
}

function dfs(graph, start, goal) {
  let shortestPath = null;
  let minCost = Infinity;

  function algorithm(city, path, cost) { 
    if (city === goal) {
      if (cost < minCost) {
        minCost = cost;
        shortestPath = [...path];
      }
      return;
    }

    for (let neighbor in graph[city]) {
      if (!path.includes(neighbor)) {
        algorithm(neighbor, [...path, neighbor], cost + graph[city][neighbor]);
      }
    }
  }

  algorithm(start, [start], 0);
  return shortestPath ?? [];
}

function ldfs(graph, start, goal) {
  let shortestPath = null;
  let minCost = Infinity;

  function dfs(city, path, cost, depth) {
    if (depth > MAX_DEPTH) return;

    if (city === goal) {
      if (cost < minCost) {
        minCost = cost;
        shortestPath = [...path];
      }
      return;
    }

    for (let neighbor in graph[city]) {
      if (!path.includes(neighbor)) {
        dfs(neighbor, [...path, neighbor], cost + graph[city][neighbor], depth + 1);
      }
    }
  }

  dfs(start, [start], 0, 0);
  return shortestPath ?? [];
}

function iddfs(graph, start, goal) { 
  function limitedDFS(city, path, cost, depth, limit) {
    if (depth > limit) return null;
    if (city === goal) return { path, cost };

    let bestPath = null;
    let minCost = Infinity;

    for (let neighbor in graph[city]) {
      if (!path.includes(neighbor)) {
        let result = limitedDFS(neighbor, [...path, neighbor], cost + graph[city][neighbor], depth + 1, limit);
        if (result && result.cost < minCost) {
          bestPath = result;
          minCost = result.cost;
        }
      }
    }
    return bestPath;
  }

  for (let depth = 0; depth <= MAX_DEPTH; depth++) {
    let result = limitedDFS(start, [start], 0, 0, depth);
    if (result) {
      return result.path
    };
  }

  return null;
}

function bidirectional(graph, start, goal) {
  if (start === goal) return [start];

  function expandSearch(queue, visited, oppositeVisited) {
    if (queue.length === 0) return null;
    
    let { city, path, cost } = queue.shift();

    // Skip if we've already found a better path to this city
    if (visited[city] && visited[city].cost <= cost) {
      return null;
    }

    visited[city] = { path, cost };

    // Check if we've found a meeting point
    if (city in oppositeVisited) {
      let otherPath = oppositeVisited[city].path;
      let totalCost = cost + oppositeVisited[city].cost;
      
      // Combine paths, removing the meeting point from one side to avoid duplication
      let combinedPath = [...path];
      combinedPath.pop(); // Remove the meeting point from forward path
      combinedPath.push(...otherPath.reverse()); // Add reversed backward path
      
      return { path: combinedPath, cost: totalCost };
    }

    // Expand to neighbors
    for (let neighbor in graph[city]) {
      if (!visited[neighbor] || visited[neighbor].cost > cost + graph[city][neighbor]) {
        queue.push({
          city: neighbor,
          path: [...path, neighbor],
          cost: cost + graph[city][neighbor]
        });
      }
    }

    return null;
  }

  // Initialize queues and visited sets
  let forwardQueue = [{ city: start, path: [start], cost: 0 }];
  let backwardQueue = [{ city: goal, path: [goal], cost: 0 }];
  let forwardVisited = {};
  let backwardVisited = {};

  // Keep track of best path found
  let bestPath = null;
  let bestCost = Infinity;

  while (forwardQueue.length > 0 && backwardQueue.length > 0) {
    // Expand forward search
    let result = expandSearch(forwardQueue, forwardVisited, backwardVisited);
    if (result && result.cost < bestCost) {
      bestPath = result.path;
      bestCost = result.cost;
    }

    // Expand backward search
    result = expandSearch(backwardQueue, backwardVisited, forwardVisited);
    if (result && result.cost < bestCost) {
      bestPath = result.path;
      bestCost = result.cost;
    }

    // If we've found a path and both queues are empty, we're done
    if (bestPath && forwardQueue.length === 0 && backwardQueue.length === 0) {
      return bestPath;
    }
  }

  return bestPath || null;
}

/**
 * Creates test cases by generating all possible combinations of cities as start and goal points
 * and prints the results in a formatted table to the console.
 * 
 * @function testCases
 * @param {Function} algorithm - The search algorithm to test (e.g. BFS, DFS, UCS, etc.)
 * @param {Object} graph - The graph representing the Romanian map
 *                        Each key is a city name and its value is an object of neighboring cities with distances
 * @example
 * // Test BFS algorithm on the Romanian map
 * testCases(bfs, romaniaMap);
 * 
 * // Test DFS algorithm on the Romanian map  
 * testCases(dfs, romaniaMap);
 * 
 * @returns {void} Outputs results to console
 */
function testCases(algorithm) {
  const cities = Object.keys(graph);
  const results = [];
  const algorithmNameMap = {
    'bfs': 'Breadth-First Search',
    'dfs': 'Depth-First Search',
    'ucs': 'Uniform Cost Search',
    'ldfs': 'Limited Depth-First Search',
    'iddfs': 'Iterative Deepening Depth-First Search',
    'bidirectional': 'Bidirectional Search'
  };
  const algorithmName = algorithmNameMap[algorithm.name] || algorithm.name || 'Unknown Algorithm';

  for (const start of cities) {
    for (const goal of cities) {
      if (start === goal) continue;

      const startTime = performance.now();
      const path = algorithm(graph, start, goal);
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      const distance = calculatePathDistance(path);

      results.push({
        'Algorithm': algorithmName,
        'Start': start,
        'Goal': goal,
        'Path': Array.isArray(path) ? path.join(' → ') : 'No path found',
        'Distance (km)': distance,
        'Time (ms)': executionTime
      });
    }
  }

  // Print results in a formatted table
  console.log(`\n${algorithmName} Results`);
  console.table(results);
  console.log('\n');
}

testCases(bfs);
testCases(ucs);
testCases(dfs);
testCases(ldfs);
testCases(iddfs);
testCases(bidirectional);

/**
 * Heuristic Search 
 * Greedy Search - OK
 * A* Search - OK
 */

function greedySearch(graph, start, goal, heuristic) {
  const priorityQueue = [{ city: start, path: [start], cost: 0 }];
  const visited = new Set();

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => (heuristic[a.city] - heuristic[b.city]));

    const { city, path, cost } = priorityQueue.shift();

    if (city === goal) {
      return path;
    }

    if (!visited.has(city)) {
      visited.add(city);

      for (let neighbor in graph[city]) {
        if (!visited.has(neighbor)) {
          let newPath = [...path, neighbor];
          priorityQueue.push({
            city: neighbor,
            path: newPath,
            cost: cost + graph[city][neighbor],
          });
        }
      }
    }
  }

  return null;
}

function aStar(graph, start, goal, heuristic) {
  const openList = [{ city: start, path: [start], cost: 0 }];
  const closedList = new Set();

  const g = {};
  const f = {};

  g[start] = 0;
  f[start] = heuristic[start];

  while (openList.length > 0) {
    openList.sort((a, b) => f[a.city] - f[b.city]);
    const { city, path, cost } = openList.shift();

    if (city === goal) {
      return path;
    }

    closedList.add(city);

    for (let neighbor in graph[city]) {
      if (!closedList.has(neighbor)) {
        const newCost = cost + graph[city][neighbor];
        if (g[neighbor] === undefined || newCost < g[neighbor]) {
          g[neighbor] = newCost;
          f[neighbor] = newCost + heuristic[neighbor];

          openList.push({
            city: neighbor,
            path: [...path, neighbor],
            cost: newCost,
          });
        }
      }
    }
  }

  return null; // Se não encontrar um caminho
}

/**
 * Generates heuristic values for all cities based on pre-calculated straight-line distances.
 * This is an admissible heuristic that underestimates the actual distance.
 * 
 * @function generateStraightLineHeuristic
 * @param {string} goal - The goal city
 * @returns {Object} An object mapping each city to its estimated distance to the goal
 */
function generateStraightLineHeuristic(goal) {
  const heuristic = {};
  const cities = Object.keys(graph);
  
  cities.forEach(city => {
    heuristic[city] = cityDistances[city][goal];
  });
  
  return heuristic;
}

/**
 * Creates test cases for heuristic-based search algorithms by generating all possible combinations 
 * of cities as start and goal points and prints the results in a formatted table to the console.
 * 
 * @function testCasesWithHeuristic
 * @param {Function} algorithm - The heuristic search algorithm to test (e.g. Greedy Search, A*)
 * @param {Function} heuristicFunction - Function that generates heuristic values for each city
 *                                      given a goal city
 * @example
 * // Test Greedy Search with straight-line distance heuristic
 * testCasesWithHeuristic(greedySearch, generateStraightLineHeuristic);
 * 
 * @returns {void} Outputs results to console
 */
function testCasesWithHeuristic(algorithm, heuristicFunction) {
  const cities = Object.keys(graph);
  const results = [];
  const algorithmNameMap = {
    'greedySearch': 'Greedy Search',
    'aStar': 'A* Search'
  };
  const algorithmName = algorithmNameMap[algorithm.name] || algorithm.name || 'Unknown Algorithm';

  const heuristics = {};
  cities.forEach(goal => {
    heuristics[goal] = heuristicFunction(goal);
  });

  for (const start of cities) {
    for (const goal of cities) {
      if (start === goal) continue;

      const startTime = performance.now();
      const path = algorithm(graph, start, goal, heuristics[goal]);
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      const distance = calculatePathDistance(path);

      results.push({
        'Algorithm': algorithmName,
        'Start': start,
        'Goal': goal,
        'Path': Array.isArray(path) ? path.join(' → ') : 'No path found',
        'Distance (km)': distance,
        'Time (ms)': executionTime
      });
    }
  }

  // Print results in a formatted table
  console.log(`\n${algorithmName} Results`);
  console.table(results);
  console.log('\n');
}

testCasesWithHeuristic(greedySearch, generateStraightLineHeuristic);
testCasesWithHeuristic(aStar, generateStraightLineHeuristic);