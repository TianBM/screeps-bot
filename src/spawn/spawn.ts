import { carryRun } from '../creeps/carryRun';

import { upgradeRun } from '../creeps/upgradeRun';

import { builderRun } from '../creeps/builderRun';

import { tinkerRun } from '../creeps/tinkerRun';
import { extendCreep } from 'types/extendCreep';

export function spawnRun(spawnObj: StructureSpawn, type: string){

    const creepsConfig = {
        carry:{
            number: 5
        },
        upgrader:{
            number: 3
        },
        builder:{
            number: 2
        },
        tinker:{
            number: 1
        }
    }

    const carryArr = splitCreep('carry');

    const upgradeArr = splitCreep('upgrader')

    const builderArr = splitCreep('builder')

    const tinkerArr = splitCreep('tinker')

    if(carryArr.length < creepsConfig.carry.number){
        if(spawnObj.store.energy >= 300){
            spawnObj.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `carry-worker-${new Date().getTime()}`);
        }
    }else{
        console.log('carry say:', 'we have enough number');
    }

    if(upgradeArr.length < creepsConfig.upgrader.number){
        if(spawnObj.store.energy >= 300){
            spawnObj.spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], `upgrader-worker-${new Date().getTime()}`);
        }
    }else{
        console.log('upgrader say:', 'we have enough number');
    }

    if(spawnObj.room.find(FIND_CONSTRUCTION_SITES).length > 0){
        if(builderArr.length < creepsConfig.builder.number){
            if(spawnObj.store.energy >= 300){
                spawnObj.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `builder-worker-${new Date().getTime()}`);
            }
        }else{
            console.log('builder say:', 'we have enough number');
        }
    }

    if(spawnObj.room.find(FIND_MY_STRUCTURES).length){
        if(tinkerArr.length < creepsConfig.tinker.number){
            if(spawnObj.store.energy >= 300){
                spawnObj.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `tinker-worker-${new Date().getTime()}`);
            }
        }else{
            console.log('tinker say:', 'we have enough number');
        }
    }

    carryArr.forEach((creep: extendCreep) => {
        carryRun(creep);
        if(creep.memory.status === 'renewing'){
            if(carryArr.length <= creepsConfig.carry.number && (creep.memory.maxTick?(creep.memory.maxTick>200):true)){
                spawnObj.renewCreep(creep);
                creep.memory.status = 'renewed';
            }else{
                spawnObj.recycleCreep(creep);
            }
        }
    })

    upgradeArr.forEach((creep: extendCreep) => {
        upgradeRun(creep);
        if(creep.memory.status === 'renewing'){
            if(upgradeArr.length <= creepsConfig.upgrader.number && (creep.memory.maxTick?(creep.memory.maxTick>200):true)){
                spawnObj.renewCreep(creep);
                creep.memory.status = 'renewed';
            }else{
                spawnObj.recycleCreep(creep);
            }
        }
    })

    builderArr.forEach((creep: extendCreep) => {
        builderRun(creep);
        if(creep.memory.status === 'renewing'){
            if(builderArr.length <= creepsConfig.builder.number && (creep.memory.maxTick?(creep.memory.maxTick>200):true)){
                spawnObj.renewCreep(creep);
                creep.memory.status = 'renewed';
            }else{
                spawnObj.recycleCreep(creep);
            }
        }
    })

    tinkerArr.forEach((creep: extendCreep) => {
        tinkerRun(creep);
        if(creep.memory.status === 'renewing'){
            if(tinkerArr.length <= creepsConfig.tinker.number && (creep.memory.maxTick?(creep.memory.maxTick>200):true)){
                spawnObj.renewCreep(creep);
                creep.memory.status = 'renewed';
            }else{
                spawnObj.recycleCreep(creep);
            }
        }
    })


    // initContainers(spawnObj);
}

function splitCreep(type: string) {

    const creepArr = Object.keys(Game.creeps);

    const result: any[] = [];

    creepArr.forEach(creep => {
        const nameArr = creep.split('-');

        const creepType = nameArr[0];

        if(creepType === type){
            result.push(Game.creeps[creep]);
        }
    })

    return result;
}

function initContainers(spawn: StructureSpawn){
    const containersSize = 2;

    const sites = spawn.room.find(FIND_CONSTRUCTION_SITES);

    console.log('init containers')

    for(let x = 0; x <= containersSize; x++){
        for(let y = 0; y <= containersSize; y++){
            if(x!==0||y!==0){

                if(!sites.find(site => site.pos === spawn.room.getPositionAt(spawn.pos.x + x , spawn.pos.y + y))){
                    spawn.room.createConstructionSite(spawn.pos.x + x , spawn.pos.y + y, STRUCTURE_CONTAINER);
                }

                if(!sites.find(site => site.pos === spawn.room.getPositionAt(spawn.pos.x - x , spawn.pos.y - y))){
                    spawn.room.createConstructionSite(spawn.pos.x - x , spawn.pos.y - y, STRUCTURE_CONTAINER);
                }
            }
        }
    }
}
