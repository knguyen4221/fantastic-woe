import { NgModule } from "@angular/core";
import { D3Service } from "./services/d3.service";
import { LinkTemplate } from "./components/link/link.component";
import { NodeTemplate } from "./components/node/node.component";
import { AddNodeDirective } from "./directives/add-node.directive";
import { DraggableDirective } from "./directives/draggable.directive";
import { SelectableNodeDirective } from "./directives/select-node.directive";
import { CommonModule } from "@angular/common";
import { LinkableDirective } from "./directives/linkable.directive";
import { DragLine } from "./components/dragline/dragline.component";
import { ModifyWeightDirective } from "./directives/mod-weight.directive";
import { EdgePipe } from "./pipes/edge.pipe";
import { LabelOrientationPipe } from "./pipes/label-orientation.pipe";

@NgModule({
    declarations: [
        LinkTemplate,
        NodeTemplate,
        DragLine,
        AddNodeDirective,
        DraggableDirective,
        SelectableNodeDirective,
        LinkableDirective,
        ModifyWeightDirective,
        EdgePipe,
        LabelOrientationPipe
    ],
    providers: [
        D3Service
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LinkTemplate,
        NodeTemplate,
        DragLine,
        AddNodeDirective,
        DraggableDirective,
        EdgePipe,
        LabelOrientationPipe
    ]
})
export class SharedModule {

}