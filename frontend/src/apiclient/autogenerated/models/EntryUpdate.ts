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
import {
  AttributeData,
  AttributeDataFromJSON,
  AttributeDataFromJSONTyped,
  AttributeDataToJSON,
} from "./AttributeData";

/**
 *
 * @export
 * @interface EntryUpdate
 */
export interface EntryUpdate {
  /**
   *
   * @type {number}
   * @memberof EntryUpdate
   */
  readonly id: number;
  /**
   *
   * @type {string}
   * @memberof EntryUpdate
   */
  name?: string;
  /**
   *
   * @type {Array<AttributeData>}
   * @memberof EntryUpdate
   */
  attrs?: Array<AttributeData>;
}

export function EntryUpdateFromJSON(json: any): EntryUpdate {
  return EntryUpdateFromJSONTyped(json, false);
}

export function EntryUpdateFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EntryUpdate {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    name: !exists(json, "name") ? undefined : json["name"],
    attrs: !exists(json, "attrs")
      ? undefined
      : (json["attrs"] as Array<any>).map(AttributeDataFromJSON),
  };
}

export function EntryUpdateToJSON(value?: EntryUpdate | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    attrs:
      value.attrs === undefined
        ? undefined
        : (value.attrs as Array<any>).map(AttributeDataToJSON),
  };
}
