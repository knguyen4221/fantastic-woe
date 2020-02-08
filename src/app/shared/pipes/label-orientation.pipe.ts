import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'labelOrientation'
})
export class LabelOrientationPipe implements PipeTransform {
    transform(value: number, sourceNodeX: number, targetNodeX: number) {
        if(sourceNodeX >= targetNodeX) {
            return value.toString().split('').reverse().join('');
        }
        return value.toString();
    }

}