import { Component, Input, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Node } from '../../models/node.model';
import { D3Service } from "../../services/d3.service";
import { NodeConfig } from "../../constants/node.config";
import { LinkTemplate } from "../link/link.component";


@Component({
    selector: '[dragLine]',
    templateUrl: './dragline.component.html',
    styleUrls: ['./dragline.component.scss']
})
export class DragLine {

    //TODO: start change detection only when isHidden is active
    @Input() dragLine;
    @Input() directed;

    isHidden: boolean;
    startNode: Node;
    endCoord: {x: number, y: number};

    constructor(private d3service: D3Service, private changeDetectionRef: ChangeDetectorRef){
        this.startNode = new Node();
        this.startNode.x = 0, this.startNode.y = 0;
        this.endCoord = {x: 0, y: 0};
    }

    ngOnInit() {
        this.d3service.mouseDownNode.subscribe((node) => {
            this.startNode = node;
        });

        this.d3service.linking.subscribe((isLinking) => {
            this.isHidden = !isLinking;
        });

        this.d3service.linkEnd.subscribe((endCoord) => {
            this.endCoord = endCoord;
        });
    }

}
