import {smooth} from './primitives';
// Explicit demonstration state, not an empirically calibrated market model.
export function stateAt(t:number){
 const entry=smooth((t-2)/2.5),competition=smooth((t-4.5)/2);
 return {entry,competition,price:24-6*competition,cost:12,profit:12-6*competition,signal:smooth(t/.9)};
}
