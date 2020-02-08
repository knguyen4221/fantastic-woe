import { Directive, Input, ElementRef } from "@angular/core";
import { ForceDirectedGraph } from '../models/graph.model';
import { D3Service } from '../services/d3.service';
import { Node } from '../models/node.model';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective {

    @Input() forceGraph;

    private _draggable;
    @Input()
    set draggable(value: boolean) {
        this._draggable = value;
        if(this._draggable) {
            this.d3Service
                .applyDrag(this._element.nativeElement.querySelector(".draggable"), 
                    this.dragNode, this.forceGraph);
        } else {
            this.d3Service.disableDrag(this._element.nativeElement.querySelector(".draggable"), 
                this.dragNode, this.forceGraph);
        }
    }
    
    get draggable(): boolean {
        return this._draggable;
    }

    @Input() dragNode;
    @Input() containerElement;
    constructor(private d3Service: D3Service, private _element: ElementRef){}

}