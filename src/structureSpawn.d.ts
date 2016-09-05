declare const StructureSpawn: StructureSpawnConstructor;

interface StructureSpawnConstructor {
  prototype: StructureSpawn;
}

type Spawn = StructureSpawn;

/**
 * Spawn is your colony center. This structure can create, renew, and recycle creeps. All your spawns are accessible through Game.spawns
 * hash list. Spawns auto-regenerate a little amount of energy each tick, so that you can easily recover even if all your creeps died.
 */
interface StructureSpawn extends OwnedStructure {

  /**
   * The amount of energy containing in the spawn.
   */
  energy: number;

  /**
   * The total amount of energy the spawn can contain
   */
  energyCapacity: number;

  /**
   * A shorthand to Memory.spawns[spawn.name]. You can use it for quick access the spawn’s specific memory data object.
   */
  memory: SpawnMemory;

  /**
   * Spawn’s name. You choose the name upon creating a new spawn, and it cannot be changed later. This name is a hash key to access the
   * spawn via the Game.spawns object.
   */
  name: string;

  /**
   * If the spawn is in process of spawning a new creep, this object will contain the new creep’s information, or null otherwise.
   */
  spawning: SpawningCreep;

  /**
   * CPU cost: LOW
   *
   * Check if a creep can be created.
   *
   * @param body An array describing the new creep’s body. Should contain 1 to 50 elements with one of these constants:
   *     WORK, MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, TOUGH, CLAIM
   * @param name The name of a new creep. It should be unique creep name, i.e. the Game.creeps object should not
   *     contain another creep with the same name (hash key). If not defined, a random name will be generated.
   * @returns Return code: OK, ERR_NOT_OWNER, ERR_NAME_EXISTS, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  canCreateCreep(body: BodyPartType[], name?: string): ResponseCode;

  /**
   * CPU cost: CONST
   *
   * Start the creep spawning process. The required energy amount can be withdrawn from all spawns and extensions in the room.
   *
   * @param body An array describing the new creep’s body. Should contain 1 to 50 elements with one of these constants:
   *     WORK, MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, TOUGH, CLAIM
   * @param name The name of a new creep. It should be unique creep name, i.e. the Game.creeps object should not
   *     contain another creep with the same name (hash key). If not defined, a random name will be generated.
   * @param memory The memory of a new creep. If provided, it will be immediately stored into Memory.creeps[name].
   * @returns name of creep or: ERR_NOT_OWNER, ERR_NAME_EXISTS, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createCreep(body: BodyPartType[], name?: string, memory?: CreepMemory): ResponseCode | string;

  /**
   * CPU cost: CONST
   *
   * Kill the creep and drop up to 100% of resources spent on its spawning and boosting depending on remaining life time. The target should
   * be at adjacent square.
   *
   * @param target The target creep object.
   * @returns Return code: OK, ERR_NOT_OWNER, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE
   */
  recycleCreep(target: Creep): ResponseCode;

  /**
   * CPU cost: CONST
   *
   * Increase the remaining time to live of the target creep. The target should be at adjacent square. The spawn should not be busy with
   * the spawning process. Each execution increases the creep's timer by amount of ticks according to this formula: floor(600/body_size).
   * Energy required for each execution is determined using this formula: ceil(creep_cost/2.5/body_size). Renewing a creep removes all of
   * its boosts.
   *
   * @param target The target creep object.
   * @returns Return code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, ERR_INVALID_TARGET, ERR_FULL, ERR_NOT_IN_RANGE
   */
  renewCreep(target: Creep): ResponseCode;

  /**
   * CPU cost: CONST
   *
   * Transfer resource from this terminal to a creep. The target has to be at adjacent square. You can transfer resources to your creeps
   * from hostile structures as well. This method is deprecated. Please use Creep.withdraw instead.
   *
   * @deprecated
   * @param target The target object.
   * @param amount The amount of resources to be transferred. If omitted, all the available amount is used.
   * @returns Return code: OK, ERR_NOT_OWNER, ERR_NOT_ENOUGH_RESOURCES, ERR_INVALID_TARGET, ERR_FULL, ERR_NOT_IN_RANGE
   */
  transferEnergy(target: Creep, amount?: number): ResponseCode;

}

interface SpawningCreep {

  /**
   * The name of a new creep.
   */
  name: string;

  /**
   * Time needed in total to complete the spawning.
   */
  needTime: number;

  /**
   * Remaining time to go.
   */
  remainingTime: number;

}
