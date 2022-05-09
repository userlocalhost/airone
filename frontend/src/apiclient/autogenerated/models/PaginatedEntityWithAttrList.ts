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
  EntityWithAttr,
  EntityWithAttrFromJSON,
  EntityWithAttrFromJSONTyped,
  EntityWithAttrToJSON,
} from "./EntityWithAttr";

/**
 *
 * @export
 * @interface PaginatedEntityWithAttrList
 */
export interface PaginatedEntityWithAttrList {
  /**
   *
   * @type {number}
   * @memberof PaginatedEntityWithAttrList
   */
  count?: number;
  /**
   *
   * @type {string}
   * @memberof PaginatedEntityWithAttrList
   */
  next?: string | null;
  /**
   *
   * @type {string}
   * @memberof PaginatedEntityWithAttrList
   */
  previous?: string | null;
  /**
   *
   * @type {Array<EntityWithAttr>}
   * @memberof PaginatedEntityWithAttrList
   */
  results?: Array<EntityWithAttr>;
}

export function PaginatedEntityWithAttrListFromJSON(
  json: any
): PaginatedEntityWithAttrList {
  return PaginatedEntityWithAttrListFromJSONTyped(json, false);
}

export function PaginatedEntityWithAttrListFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PaginatedEntityWithAttrList {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    count: !exists(json, "count") ? undefined : json["count"],
    next: !exists(json, "next") ? undefined : json["next"],
    previous: !exists(json, "previous") ? undefined : json["previous"],
    results: !exists(json, "results")
      ? undefined
      : (json["results"] as Array<any>).map(EntityWithAttrFromJSON),
  };
}

export function PaginatedEntityWithAttrListToJSON(
  value?: PaginatedEntityWithAttrList | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    count: value.count,
    next: value.next,
    previous: value.previous,
    results:
      value.results === undefined
        ? undefined
        : (value.results as Array<any>).map(EntityWithAttrToJSON),
  };
}
