import { Directive, Input, ElementRef } from "@angular/core";
import { Link } from "../models/link.model";
import { D3Service } from "../services/d3.service";

@Directive({
    selector: "[modWeight]"
})
export class ModifyWeightDirective {
    
    @Input("modWeight") link: Link;
    @Input() directed: boolean;
    
    constructor(private d3Service: D3Service, private element: ElementRef) {

    }

    ngOnInit() {
        this.d3Service.applySelectLink(this.element.nativeElement, this.link, this.directed);
    }
}