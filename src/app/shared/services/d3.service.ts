import * as d3 from 'd3';
import { Injectable, ElementRef } from '@angular/core';
import { Link } from '../models/link.model';
import { Node } from '../models/node.model';
import { ForceDirectedGraph } from '../models/graph.model';
import { Subject } from 'rxjs';
import { forceSimulation, Force } from 'd3';
import { Coordinate } from '../models/coordinate.model';

@Injectable()
export class D3Service {

    addNode: Subject<Node>;
    selectedNode: Subject<number>;
    selectedLink: Subject<number>;
    mouseDownNode: Subject<Node>;
    linking: Subject<boolean>;
    linkEnd: Subject<Coordinate>;
    addLink: Subject<Coordinate>;
    deleteLink: Subject<number>;
    deleteNode: Subject<number>;
    lastAddedNode = 0

    constructor() {
        this.addNode = new Subject<Node>();
        this.selectedNode = new Subject<number>();
        this.selectedLink = new Subject<number>();
        this.mouseDownNode = new Subject<Node>();
        this.linking = new Subject<boolean>();
        this.linkEnd = new Subject<Coordinate>(); 
        this.addLink = new Subject<Coordinate>();
        this.deleteLink = new Subject<number>();
        this.deleteNode = new Subject<number>();
    }

    applySVGNodeAddBehavior(containerElement) {
        let container = d3.select(containerElement);
        container.on("mousedown", () => {
            let coords = d3.mouse(containerElement);
            let newNode: Node = new Node();
            newNode.x = coords[0] as number;
            newNode.y = coords[1] as number;
            this.addNode.next(newNode);
        });
    }

    disableSVGNodeAddBehavior(containerElement) {
        let container = d3.select(containerElement);
        container.on("mousedown", null);
    }

    applySelectNodeBehavior(node: Node, nodeElement) {
        let element = d3.select(nodeElement);
        element.on("mousedown", () => {
            d3.event.stopPropagation();
            this.selectedNode.next(node.id);
        }).on("keydown", () => {
            if(d3.event.keyCode === 46) {
                this.deleteNode.next(node.id);
            }
        });

    }

    applyDrag(element, d, graph: ForceDirectedGraph) {
        let nodeElement = d3.select(element);

        function dragStart(){
            d3.event.sourceEvent.stopPropagation();
            if(!d3.event.active){
                graph.simulation.alphaTarget(.1).restart();
            }
            d3.event.on("drag", dragged).on("end", dragend);

            function dragged(){ 
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragend() {
                if(!d3.event.active) {
                    graph.simulation.alphaTarget(0);
                }
                d.fx = null;
                d.fy = null;
            }
        }
        nodeElement.call(d3.drag()
            .on("start", dragStart));
        
    }

    disableDrag(element, dragNode, graph: ForceDirectedGraph) {
        let node = d3.select(element);
        node.on(".drag", null);
        //Temp fix
        this.applyLinkable(element, dragNode);
    }

    applyLinkable(element, node: Node) {
        // Healthy alternative might be to create drag lines for each node instead of having one
        // that you constantly update
        let nodeElement = d3.select(element);
        let dragStart = () => {
            d3.event.sourceEvent.stopPropagation();
            this.mouseDownNode.next(node);
            this.linkEnd.next({x: node.x, y: node.y});
        }
        let drag = () => {
            this.linking.next(true);
            this.linkEnd.next({x: d3.event.x, y: d3.event.y});
        }

        let dragEnd = () => {
            this.linking.next(false);
            this.addLink.next({x: d3.event.x, y:d3.event.y});
        }
        nodeElement.call(d3.drag()
            .on("start", dragStart)
            .on("drag", drag)
            .on("end", dragEnd));
        
    }

    applySelectLink(element, link: Link, directed: boolean) {
        let textElement = d3.select(element);
        textElement.on("mousedown", () => {
            d3.event.stopPropagation();
            this.selectedLink.next(link.index);
        }).on("keydown", () => {
            if(d3.event.keyCode === 8) {
                link.weight = Math.floor(link.weight/10);
            } else if (d3.event.keyCode === 46) {
                this.deleteLink.next(link.index);
            } else if (!(d3.event.keyCode < 48 || d3.event.keyCode > 57)) {
                link.weight = (link.weight*10)+parseInt(d3.event.key);
            }
            if(!directed) {
                link.targetNode.edges.get(link.sourceNode.id).weight = link.weight;
            }
            return;
        });
    }
    
}