export type extendCreep = Creep & {
    memory:{
        role: string,
        room: string,
        working: boolean,
        status: string,
        maxTick: number | undefined
    }
}
