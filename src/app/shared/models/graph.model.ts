import { EventEmitter } from '@angular/core';
import { Node } from './node.model';
import { Link } from './link.model';
import * as d3 from 'd3';

export class ForceDirectedGraph {

    public ticker: EventEmitter<d3.Simulation<Node, Link>> = new EventEmitter();
    public simulation: d3.Simulation<any, Link>;

    public nodes: Node[] = [];
    public links: Link[] = [];
    public config: { width: number, height: number };

    private static FORCES = { CHARGE: -750, LINKS: 1/50, FORCELINKDISTANCE: 200 };

    constructor(nodes, links, options){
        this.nodes = nodes;
        this.links = links;
        this.config = options;
    }

    initSimulation() {
        if (!this.simulation) {
            this.simulation = d3.forceSimulation()
                .force("charge", d3.forceManyBody()
                                    .strength(ForceDirectedGraph.FORCES.CHARGE))
                .force("collisionForce", d3.forceCollide(12))
                .force('x', d3.forceX(this.config.width/2))
                .force('y', d3.forceY(this.config.height/2));
                                                    
            const ticker = this.ticker;
            this.simulation.on("tick", function () {
                ticker.emit(this);
            });
            this.simulation.nodes(this.nodes);
        }
        this.simulation.alphaTarget(.1).restart();
    }

    pushNode(node: Node) {
        this.nodes.push(node);
        this.simulation.nodes(this.nodes);
        this.initSimulation();
    }

    addLink(link: Link) {
        this.links.push(link);
        this.simulation.force("links", d3.forceLink(this.links)
            .distance(ForceDirectedGraph.FORCES.FORCELINKDISTANCE));
        this.initSimulation();
    }

    removeLink(link: Link) {
        let toRemove = this.links.findIndex((tofind: Link) => tofind.sourceNode.id === link.sourceNode.id && 
            tofind.targetNode.id === link.targetNode.id);
        this.removeLinkByIndex(toRemove);
    }

    removeLinkById(linkId: number) {
        let toRemove = this.links.findIndex((tofind: Link) => tofind.index === linkId);
        this.removeLinkByIndex(toRemove);
    }

    removeLinkByIndex(index: number) {
        this.links[index].sourceNode.edges.delete(this.links[index].targetNode.id);
        this.links.splice(index, 1);
        this.simulation.force("links", d3.forceLink(this.links)
            .distance(ForceDirectedGraph.FORCES.FORCELINKDISTANCE));
        this.initSimulation();
    }

    removeNodeById(id: number) {
        let toRemove = this.nodes.findIndex((node: Node) => node.id == id);
        this.links = this.links.filter((link: Link) => link.targetNode.id !== id && link.sourceNode.id !== id);
        this.nodes.splice(toRemove, 1);
        this.simulation.nodes(this.nodes);
        this.simulation.force("links", d3.forceLink(this.links)
            .distance(ForceDirectedGraph.FORCES.FORCELINKDISTANCE));
        this.initSimulation();
    }

    clearLinks() {
        for(let node of this.nodes) {
            node.edges.clear();
        }
        this.links.splice(0, this.links.length);
        this.simulation.force("links", d3.forceLink(this.links)
            .distance(ForceDirectedGraph.FORCES.FORCELINKDISTANCE));
        this.initSimulation();
    }

    getNodeIndexById(nodeId: number) {
        let i = 0
        let j = this.nodes.length-1
        while(i !== j) {
            let mid = Math.floor((i+j)/2);
            if(nodeId < this.nodes[mid].id) {
                j = mid;
            } else if(nodeId > this.nodes[mid].id) {
                i = mid+1;
            } else {
                return mid;
            }
        }
        return i;
    }

    getNodeByIndex(nodeIndex: number) {
        return this.nodes[nodeIndex];
    }

    toggleNodeActivity(nodeIndex: number) {
        this.nodes[nodeIndex].isSelected = !this.nodes[nodeIndex].isSelected;
        this.simulation.restart();
    }

    tick() {
        //Exclusively for the purpose of triggering change detection
        this.ticker.emit(this.simulation);
    }
}