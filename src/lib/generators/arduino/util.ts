import * as Blockly from 'blockly';

export let Arduino = new Blockly.Generator('Arduino');

export enum Order {
    ATOMIC = 0,
    UNARY_POSTFIX = 1,
    UNARY_PREFIX = 2,
    MULTIPLICATIVE = 3,
    ADDITIVE = 4,
    SHIFT = 5,
    RELATIONAL = 6,
    EQUALITY = 7,
    BITWISE_AND = 8,
    BITWISE_XOR = 9,
    BITWISE_OR = 10,
    LOGICAL_AND = 11,
    LOGICAL_OR = 12,
    CONDITIONAL = 13,
    ASSIGNMENT = 14,
    NONE = 99
}

export let definitions: { [key: string]: string } = {};
export let setups: { [key: string]: string } = {};