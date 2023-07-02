/* tslint:disable */
/* eslint-disable */
/**
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
/**
 *
 * @export
 * @interface Attribute
 */
export interface Attribute {
  /**
   *
   * @type {number}
   * @memberof Attribute
   */
  readonly id: number;
  /**
   *
   * @type {string}
   * @memberof Attribute
   */
  name: string;
}

/**
 * Check if a given object implements the Attribute interface.
 */
export function instanceOfAttribute(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && "id" in value;
  isInstance = isInstance && "name" in value;

  return isInstance;
}

export function AttributeFromJSON(json: any): Attribute {
  return AttributeFromJSONTyped(json, false);
}

export function AttributeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Attribute {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    name: json["name"],
  };
}

export function AttributeToJSON(value?: Attribute | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
  };
}
