import { Directive, Input, ElementRef } from "@angular/core";
import { D3Service } from "../services/d3.service";
import { Link } from "../models/link.model";
import { Node } from "../models/node.model"

@Directive({
    selector: "[linkable]"
})
export class LinkableDirective {
    @Input() linkable: Node;


    constructor(private d3Service: D3Service, private element: ElementRef){}

    ngOnInit(){
        this.d3Service.applyLinkable(this.element.nativeElement, this.linkable);
    }
}