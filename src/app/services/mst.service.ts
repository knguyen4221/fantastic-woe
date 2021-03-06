import { Injectable } from "@angular/core";
import { ForceDirectedGraph } from "../shared/models/graph.model";
import { Node } from "../shared/models/node.model";
import { BinaryHeap } from "../shared/helpers/binary-heap";
import { Link } from "../shared/models/link.model";

@Injectable()
export class MSTService {
    *PrimMST(graph: ForceDirectedGraph, startVertex: Node, connectionCost: Map<number, number>, 
            edgeTo: Map<number, Link>, pq: BinaryHeap<Node>) {
        while(pq.length != 0) {
            let newNode = pq.pop();
            if(edgeTo.get(newNode.id) !== null) {
                edgeTo.get(newNode.id).isActive = true;
                newNode.edges.get(edgeTo.get(newNode.id).sourceNode.id).isActive = true;
            }
            newNode.isActive = true;
            graph.tick();
            for(let edge of newNode.edges.values()) {
                if(connectionCost.get(edge.targetNode.id) > edge.weight) {
                    connectionCost.set(edge.targetNode.id, edge.weight);
                    edge.touched = true
                    edge.targetNode.edges.get(edge.sourceNode.id).touched = true;
                    edgeTo.set(edge.targetNode.id, edge);
                    pq.decreaseKey(edge.targetNode);
                }
                graph.tick();
            }
            yield newNode;
        }
        return;
    }
}