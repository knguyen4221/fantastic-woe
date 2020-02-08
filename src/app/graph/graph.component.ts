import { Component, OnInit } from '@angular/core';
import { Node } from "../shared/models/node.model";
import { Link } from "../shared/models/link.model";
import { ForceDirectedGraph } from "../shared/models/graph.model";
import { MSTService } from '../services/mst.service';
import { MSTSimulation } from '../shared/models/mstSimulation.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  //TODO: add svg export features
  //TODO: export graph svg as either graph wiz or others

  graph: ForceDirectedGraph;
  digraph: boolean = false;

  private lastAddedNode: number = 0;

  constructor(private mst: MSTService) {}

  addNode(node: Node){
    node.id = ++this.lastAddedNode;
    this.graph.pushNode(node);
  }
  
  addLink(link: Link){
    if(link.sourceNode.edges.get(link.targetNode.id)){
      return;
    }
    link.sourceNode.edges.set(link.targetNode.id, link);
    if(!this.digraph){
      let rlink = new Link(link.targetNode, link.sourceNode, link.weight);
      link.targetNode.edges.set(link.sourceNode.id, rlink);
    }
    this.graph.addLink(link);
  }

  deleteLink(id: number) {
    this.graph.removeLinkById(id);
  }

  deleteNode(id: number) {
    this.graph.removeNodeById(id);
  }

  clearLinksAndEdges() {
    this.graph.clearLinks();
  }

  ngOnInit(): void {
    this.graph = new ForceDirectedGraph([], [], {width:800, height:600});
  }

}
