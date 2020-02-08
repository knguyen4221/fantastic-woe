import { Directive, ElementRef, Input } from "@angular/core";
import { D3Service } from "../services/d3.service";
import { ForceDirectedGraph } from "../models/graph.model";

@Directive({
    selector: '[addNode]'
})
export class AddNodeDirective {

    private _canAdd: boolean;
    @Input() 
    set addNode(value: boolean) {
        this._canAdd = value;
        if(this._canAdd) {
            this.d3Service.applySVGNodeAddBehavior(this._element.nativeElement);
        } else {
            this.d3Service.disableSVGNodeAddBehavior(this._element.nativeElement);
        }
    }
    get addNode() {
        return this._canAdd;
    }

    constructor(private d3Service: D3Service, private _element: ElementRef){}

}