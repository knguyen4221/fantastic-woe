import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Node } from "../../models/node.model";
import { NodeConfig } from "../../constants/node.config";
import { EventEmitter } from "@angular/core";
import { Link } from "../../models/link.model";

@Component({
    selector: '[nodeTemplate]',
    templateUrl: './node.component.html',
    styleUrls: ["./node.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTemplate {
    @Input("nodeTemplate") node: Node;
    @Input() ticker: EventEmitter<d3.Simulation<Node, Link>>;

    nodeRadius = NodeConfig.radius;

    constructor(private cd: ChangeDetectorRef){}

    ngOnInit(){
        this.ticker.subscribe(() => {
            this.cd.markForCheck();
        });
    }
}