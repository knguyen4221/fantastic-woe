import { Pipe, PipeTransform } from "@angular/core";
import { Link } from "../models/link.model";

@Pipe({
    name: "asEdge"
})
export class EdgePipe implements PipeTransform {
    transform(startNodeX: number, startNodeY: number, targetNodeX: number, targetNodeY: number, nodeRadius?: number, 
    arcDistance?: number, isDirected?: boolean, isArc?: boolean) {
        if(!startNodeX || !startNodeY || !targetNodeX || !targetNodeY) {
            return ''
        }
        if(nodeRadius === 0){
            return `M${startNodeX},${startNodeY}L${targetNodeX},${targetNodeY}`;
        }
        let deltaX = targetNodeX - startNodeX;
        let deltaY = targetNodeY - startNodeY;
        let dist = Math.sqrt((deltaX*deltaX)+(deltaY*deltaY))
        let sourcesin = deltaY / dist;
        let targetsin = deltaX / dist;
        let newDY = (nodeRadius)*sourcesin;
        let newDX = (nodeRadius)*targetsin;
        if(!isDirected || !isArc){
            return `M${startNodeX+newDX},${startNodeY+newDY}L${targetNodeX-newDX},${targetNodeY-newDY}`;
        } else {
            let midX = (startNodeX+targetNodeX)/2;
            let midY = (startNodeY+targetNodeY)/2;
            let slope = (deltaX/deltaY)*-1
            let xOffset = arcDistance*(1/(Math.sqrt(1+slope*slope)));
            let yOffset = (arcDistance*(slope/(Math.sqrt(1+slope*slope))));
            //TODO: deal with edges flipping anchors
            //Note: would need a way to determine the placement of the anchor point other
            // using sourceNode.x and targetNode.x turns it into non-continuous function
            // maybe add parameter for 1st edge and second edge to appropriate determine a continuous function for anchor position
            let _arcAnchorX;
            let _arcAnchorY;
            if(startNodeX >= targetNodeX){
                _arcAnchorX = (xOffset-midX)*-1;
                _arcAnchorY = (yOffset-midY)*-1;
            } else {
                _arcAnchorX = xOffset+midX;
                _arcAnchorY = yOffset+midY;
            }
            return `M${startNodeX+newDX},${startNodeY+newDY}Q${_arcAnchorX},${_arcAnchorY},${targetNodeX-newDX},${targetNodeY-newDY}`;
        } 
    }
}