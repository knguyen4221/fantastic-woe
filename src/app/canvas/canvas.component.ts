import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core'
import { Node } from '../shared/models/node.model';
import { Link } from '../shared/models/link.model'
import { ForceDirectedGraph } from '../shared/models/graph.model';
import { D3Service } from '../shared/services/d3.service';

@Component({
    selector: 'graph-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

    @Input() graph: ForceDirectedGraph;
    @Input() digraph: boolean;
    @Output() d3AddNode: EventEmitter<Node> = new EventEmitter<Node>();
    @Output() d3AddLink: EventEmitter<Link> = new EventEmitter<Link>();
    @Output() d3DeleteNode: EventEmitter<number> = new EventEmitter<number>();
    @Output() d3DeleteLink: EventEmitter<number> = new EventEmitter<number>();

    ctrlDraggable: boolean = false;

    private _lastHeldKey = -1;
    private _selectedNodeIndex: number = -1;
    private _selectedNodeId: number = -1;
    private _mouseDownNode: Node;
    _options: { width, height } = { width: 1000, height: 700 };

    constructor(private d3Service: D3Service, public element: ElementRef,
        private cd: ChangeDetectorRef){}

    ngOnInit() {

        this.d3Service.addNode.subscribe((node) => {
            this.d3AddNode.emit(node);
        });

        this.d3Service.selectedNode.subscribe((nodeId) => {
            if(this._selectedNodeId == nodeId) {
                this.graph.toggleNodeActivity(this._selectedNodeIndex);
                this._selectedNodeId = -1;
                this._selectedNodeIndex = -1;
            } else {
                if(this._selectedNodeIndex >= 0) {
                    this.graph.toggleNodeActivity(this._selectedNodeIndex);
                }
                this._selectedNodeIndex = this.graph.getNodeIndexById(nodeId);
                this._selectedNodeId = nodeId;
                this.graph.toggleNodeActivity(this._selectedNodeIndex);
            }
        });

        this.d3Service.mouseDownNode.subscribe((node) => {
            this._mouseDownNode = node;
        })

        this.d3Service.addLink.subscribe((coordinate) => {
            let endNode = this.graph.simulation.find(coordinate.x, coordinate.y);
            if(endNode.id !== this._mouseDownNode.id){
                let newLink = new Link(this._mouseDownNode, endNode, 0);
                if((endNode as Node).edges.has(this._mouseDownNode.id)) {
                    newLink.isArc = true;
                    (endNode as Node).edges.get(this._mouseDownNode.id).isArc = true;
                }
                this.d3AddLink.emit(newLink);
            }
        });

        this.d3Service.deleteLink.subscribe((id) => {
            let link = this.graph.links.find((link: Link) => id === link.index);
            if(link.targetNode.edges.has(link.sourceNode.id)) {
                link.targetNode.edges.get(link.sourceNode.id).isArc = false;
            }
            this.d3DeleteLink.emit(id);
        })

        this.d3Service.deleteNode.subscribe((id) => {
            if(this._selectedNodeId === id) {
                this.d3DeleteNode.emit(id);
                this._selectedNodeId = -1;
                this._selectedNodeIndex = -1
            }
        })

        this.graph.initSimulation();
    }

    @HostListener('window:keydown', ['$event'])
    onCtrlDownHandler(event: KeyboardEvent) {
        if(event.keyCode === 17 && this._lastHeldKey === -1) {
            this.ctrlDraggable = true;
            this._lastHeldKey = event.keyCode;
        }
    }

    @HostListener('window:keyup', ['$event'])
    onCtrlUpHandler(event: KeyboardEvent){
        if(event.keyCode === 17){
            this.ctrlDraggable = false;
            this._lastHeldKey = -1;
        }
    }
}