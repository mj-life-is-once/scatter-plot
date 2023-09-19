import * as d3 from "d3";
import { SampleData } from "../types/types";

export const quadSearch = (
  quadtree: d3.Quadtree<SampleData>,
  x: number,
  y: number,
  radius: number
) => {
  //console.log(xmin, ymin, xmax, ymax);
  const found: Array<SampleData> = [];

  // Visit the quadtree from the top, recursively
  quadtree.visit(
    (node: any, x1: number, y1: number, x2: number, y2: number) => {
      if (!node.length) {
        // this is a leaf node: it contains 1 point in node.data
        do {
          let d = node.data;
          // measure its euclidian distance to <x,y> and accept it if < radius
          if (Math.hypot(d.x - x, d.y - y) < radius) {
            found.push(d);
          }
        } while ((node = node.next));
      }
      // if ⟨x,y⟩ is outside the quad + a margin of radius, we know that there is no point
      // in that quad’s hierarchy that is at a distance < radius: eliminate the quad by returning truthy
      return (
        x1 >= x + radius ||
        y1 >= y + radius ||
        x2 < x - radius ||
        y2 < y - radius
      );
    }
  );

  //console.log(found);
  return found;
};

/*
Quadtree<ZyncData>.visit(callback: (node: QuadtreeLeaf<ZyncData>, x0: number, y0: number, x1: number, y1: number) => boolean | void): Quadtree<ZyncData>
Visits each node in the quadtree in pre-order traversal, 
invoking the specified callback with arguments node, x0, y0, x1, y1 for each node, 
here node is the node being visited, ⟨x0, y0⟩ are the lower bounds of the node, 
and ⟨x1, y1⟩ are the upper bounds, and returns the quadtree.

If the callback returns true for a given node, 
then the children of that node are not visited; otherwise, 
all child nodes are visited. This can be used to quickly visit only parts of the tree.
Note, however, that child quadrants are always visited in sibling 
order: top-left, top-right, bottom-left, bottom-right. In cases such as search, 
visiting siblings in a specific order may be faster
 */
