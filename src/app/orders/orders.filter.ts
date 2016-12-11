import {PipeTransform, Pipe} from "@angular/core";

@Pipe({
    name: 'orderPipe',
    pure: false
})
export class OrderPipe implements PipeTransform {
    transform(items: any[], args: any): any {
        let buy = args.buy;
        let sell = args.sell;
        return items.filter(item => item.type === (buy && sell ? item.type : buy ? 1 : 2));
    }
}
