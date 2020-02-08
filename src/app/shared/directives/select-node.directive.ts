import { Directive, Input, ElementRef } from "@angular/core";
import { D3Service } from "../services/d3.service";
import { Node } from "../models/node.model";

@Directive({
    selector: '[selectNode]'
})
export class SelectableNodeDirective {
    @Input() selectNode: Node;

    constructor(private d3Service: D3Service, private _element: ElementRef){

    }

    ngOnInit(){
        this.d3Service.applySelectNodeBehavior(this.selectNode, this._element.nativeElement);
    }
}