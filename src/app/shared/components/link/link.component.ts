import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter } from "@angular/core";
import { Link } from "../../models/link.model";
import { Node } from '../../models/node.model';
import { NodeConfig } from "../../constants/node.config";
import { Coordinate } from "../../models/coordinate.model";

@Component({
    selector: '[link]',
    templateUrl: './link.component.html',
    styleUrls: ['./link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkTemplate implements OnInit {
    @Input() link: Link;
    @Input() directed: boolean;
    @Input() ticker: EventEmitter<d3.Simulation<Node, Link>>;

    static linkChangeThreshold = .1;
    static arcDistance = 35;

    d: string;
    linkLabel: string;
    isEditing: boolean = false;
    
    private _lastArc;

    constructor(private changeDetection: ChangeDetectorRef){
    }

    get nodeRadius(): number {
        return NodeConfig.radius;
    }
    get arcDistance(): number {
        return LinkTemplate.arcDistance;
    }

    ngOnInit() {
        this._lastArc = this.link.isArc;
        this.linkLabel = this.link._weight.toString();
        this.ticker.subscribe(() => {
            this.changeDetection.markForCheck();
        });
        this.link.weightSubject.subscribe((weight) => {
            this.changeDetection.markForCheck();
        });
    }

    labelFocus(){
        this.isEditing = !this.isEditing;
        this.changeDetection.markForCheck();
    }
}