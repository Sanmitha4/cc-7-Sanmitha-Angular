// import { signal,computed,linkedSignal} from '@angular/core';

// export class HomeViewModel{
//     mode=signal<'normal'|'edit'>('normal')
//     selectedIds=linkedSignal({
//         source:this.mode(),
//         computed:(mode)=>(mode=='normal'?new Set<number>(): new Set<number>());

//     });
//     selectionCount=computed(()=>this.selectedIds().size);

//     toggleSelection(id:number){
//         if(this.mode()!=='edit'){
//             return;

//         }
//         this.selectedIds.update((prev)=>{
//             const next=new Set(prev);
//             next.has(id)?next.delete(id)

//         }


//     }
    
// }