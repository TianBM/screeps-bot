import { extendCreep } from '../types/extendCreep';

/** @param {extendCreep} creep **/
export function carryRun(creep: extendCreep) {

    if(creep.ticksToLive && creep.ticksToLive < 50){
        creep.say('renewing');
        creep.memory.status = 'renewing';
    }else if(creep.store.energy === 0) {
        creep.say('carrying');
        creep.memory.status = 'carrying';
    }else if(creep.store.energy === creep.store.getCapacity('energy')) {
        creep.say('working');
        creep.memory.status = 'working';
    }

    switch(creep.memory.status){
        case 'working':{
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_TOWER) && structure.store.energy < structure.store.getCapacity('energy');
                }
            });
            if(targets.length > 0) {
                const spawn = targets.find(structure => structure.structureType == STRUCTURE_SPAWN)
                if(spawn){
                    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            break;
        }
        case 'carrying':{
            const sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            break;
        }
        case 'renewing':{
            const spawns = creep.room.find(FIND_MY_SPAWNS);
            if(spawns.length){
                if(creep.store.energy > 0){
                    if(creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawns[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                    creep.moveTo(spawns[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            break;
        }
        case 'renewed': {
            creep.memory.maxTick = creep.ticksToLive;
            console.log(`renewed ${creep.name},now it's maxTick is ${creep.memory.maxTick}`);
            creep.memory.status = 'carrying';
            break;
        }
    }
}
