import { extendCreep } from '../types/extendCreep';

export function upgradeRun(creep: extendCreep) {

    if(creep.ticksToLive && creep.ticksToLive < 50){
        creep.say('renewing');
        creep.memory.status = 'renewing';
    }else if(creep.store.energy === 0) {
        creep.memory.status = 'carrying';
    }else if(creep.memory.status === 'carrying' && creep.store.energy === creep.store.getCapacity('energy')) {
        creep.memory.status = 'working';
    }

    switch(creep.memory.status){
        case 'working':{
            if(creep.room.controller) {
                creep.say('upgrading')
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            break;
        };
        case 'carrying':{
            const containers:StructureContainer[] = creep.room.find(FIND_STRUCTURES,{
                filter: structure=>{
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
                }
            });
            if(containers.length && containers[0].store[RESOURCE_ENERGY] > 0){
                if(creep.withdraw(containers[0],'energy') == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else{
                const resources = creep.room.find(FIND_SOURCES);
                if(resources.length){
                    if(creep.harvest(resources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
            break;
        };
        case 'renewing':{
            const spawns = creep.room.find(FIND_MY_SPAWNS);
            if(spawns.length){
                creep.moveTo(spawns[0]);
            }
            break;
        };
        case 'renewed': {
            creep.memory.maxTick = creep.ticksToLive;
            console.log(`renewed ${creep.name},now it's maxTick is ${creep.memory.maxTick}`);
            creep.memory.status = 'carrying';
            break;
        }
    }
}
