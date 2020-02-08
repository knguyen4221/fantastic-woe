import { Component, Input, Output } from "@angular/core";
import { MSTService } from "../services/mst.service";
import { ForceDirectedGraph } from "../shared/models/graph.model";
import { Node } from "../shared/models/node.model";

@Component({
    selector: 'mst-sim',
    templateUrl: './mst-simulation.component.html',
    styleUrls: ['./mst-simulation.component.scss']
})
export class MSTSimulationComponent {

    @Input() graph: ForceDirectedGraph;

    isStarted: boolean;
    current: Generator;
    lastSelectedVertex: Node;

    constructor(private mstService: MSTService) {}

    initialize(){
        if(this.graph.nodes.length > 0) {
            let startVertex = this.graph.nodes[0];
            for(let link of this.graph.links) {
                link.isActive = false;
                link.touched = false;
                let reflex = link.targetNode.edges.get(link.sourceNode.id);
                reflex.isActive = false;
                reflex.touched = false;
            }
            for(let node of this.graph.nodes) {
                node.isActive = false;
                if(node.isSelected) {
                    startVertex = node;
                    this.lastSelectedVertex = node;
                }
                node.isSelected = false;
            }
            this.graph.tick();
            this.current = this.mstService.PrimMST(this.graph, startVertex);
            this.isStarted = true;
        }
        //TODO: check for graph connectivity
    }

    tick() {
        let tick = this.current.next();
        if(tick.done) {
            this.isStarted = false;
            this.lastSelectedVertex.isSelected = true;
        }
    }

    stop(){
        for(let node of this.graph.nodes) {
            node.isActive = undefined;
        }

        for(let link of this.graph.links) {
            link.isActive = undefined;
            link.touched = undefined;
            let reflex = link.targetNode.edges.get(link.sourceNode.id);
            reflex.isActive = undefined;
            reflex.touched = undefined;
        }
        this.isStarted = false;
        this.lastSelectedVertex.isSelected = true;

    }

}