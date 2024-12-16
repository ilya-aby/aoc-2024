/**
 * A generic Priority Queue implemented with a binary min-heap.
 *
 * Example usage:
 *
 *   const pq = new PriorityQueue<{ name: string }>((x) => x.priority);
 *   pq.push({ name: 'B', priority: 10 });
 *   pq.push({ name: 'A', priority: 2 });
 *   console.log(pq.pop());  // => { name: 'A', priority: 2 }
 *   console.log(pq.pop());  // => { name: 'B', priority: 10 }
 */
export class PriorityQueue<T> {
  private heap: T[] = [];
  private priorityFn: (element: T) => number;

  /**
   * @param priorityFn A function that returns the priority for an element.
   *                   Lower means higher priority (min-heap).
   */
  constructor(priorityFn: (element: T) => number) {
    this.priorityFn = priorityFn;
  }

  get size(): number {
    return this.heap.length;
  }

  /**
   * Insert element into the priority queue.
   */
  push(element: T) {
    this.heap.push(element);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove and return the element with the smallest priority.
   * If empty, returns `undefined`.
   */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    // Swap root (min) with last, then pop
    this.swap(0, this.heap.length - 1);
    const min = this.heap.pop();
    if (this.heap.length > 0) {
      this.bubbleDown(0);
    }
    return min;
  }

  /**
   * Peek at the element with the smallest priority without removing it.
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * Return true if the queue is empty, else false.
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number) {
    // Move the element at `index` up until the heap property is restored.
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.priorityFn(this.heap[index]) >= this.priorityFn(this.heap[parent])) break;
      this.swap(index, parent);
      index = parent;
    }
  }

  private bubbleDown(index: number) {
    // Move the element at `index` down until the heap property is restored.
    const length = this.heap.length;
    const elementPriority = this.priorityFn(this.heap[index]);

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let swapIndex = -1;

      if (left < length) {
        const leftPriority = this.priorityFn(this.heap[left]);
        if (leftPriority < elementPriority) {
          swapIndex = left;
        }
      }

      if (right < length) {
        const rightPriority = this.priorityFn(this.heap[right]);
        if (
          (swapIndex === -1 && rightPriority < elementPriority) ||
          (swapIndex !== -1 && rightPriority < this.priorityFn(this.heap[swapIndex]))
        ) {
          swapIndex = right;
        }
      }

      if (swapIndex === -1) break;
      this.swap(index, swapIndex);
      index = swapIndex;
    }
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}
