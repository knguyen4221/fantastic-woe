import { Node } from "./node.model"
import { Edge } from "./interfaces/edge.interface";
import { Subject } from "rxjs";

export class Link implements d3.SimulationLinkDatum<Node>, Edge{
    source: Node | string | number;
    target: Node | string | number;
    index?: number;
    isEditing: boolean;
    isArc: boolean;

    label: string;

    _weight: number;

    weightSubject: Subject<number>;

    isActive: boolean;
    touched: boolean;

    get weight(): number {
        return this._weight;
    }
    set weight(value: number) {
        this._weight = value;
        if(this.weightSubject) {
            this.weightSubject.next(value);
        }
    }

    get destinationEdge() {
        return (this.target as Node).id;
    }

    get sourceNode(): Node {
        return this.source as Node;
    }

    get targetNode(): Node {
        return this.target as Node;
    }

    constructor(source: Node | string | number, target: Node | string | number, weight: number) {
        this.weight = weight;
        this.source = source;
        this.target = target;
        this.label = weight.toString();
        this.isArc = false;
        this.isEditing = false;
        this.weightSubject = new Subject<number>();
    }
}