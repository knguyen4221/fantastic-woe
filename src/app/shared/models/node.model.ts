import * as d3force from 'd3-force';
import { Link } from './link.model';
import { Subject } from 'rxjs';
import { Coordinate } from './coordinate.model';

export class Node implements d3force.SimulationNodeDatum{
    index: number;
    x?: number;

    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
    isSelected: boolean = false;
    
    id: number;
    label: string;

    //destination node ids => edge
    edges: Map<number, Link>;

    isActive: boolean;

    constructor(){
        this.edges = new Map<number, Link>();
    }

}