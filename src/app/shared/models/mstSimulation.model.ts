import { Node } from "./node.model";

export class MSTSimulation {
    generator: IterableIterator<Node>;
    forest: Node[];
    isStarted: boolean = false;
}