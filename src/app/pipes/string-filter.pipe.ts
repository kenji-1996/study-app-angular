import {Pipe} from "@angular/core";

/**
 * A simple string filter, since ng2 does not yet have a filter pipe built in.
 */
@Pipe({
    name: 'stringFilter'
})
export class StringFilterPipe {

    transform(value: string[], q: string, allResults: any) {
        if (!q || q === '') {
            return value;
        }
        console.log(allResults);
        for(let i = 1; i < allResults.length; i++) {
            return value.filter(item => -1 < item.toLowerCase().indexOf(q.toLowerCase()));
        }
    }
}