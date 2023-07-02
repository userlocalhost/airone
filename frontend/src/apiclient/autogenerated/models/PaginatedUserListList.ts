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
import type { UserList } from "./UserList";
import {
  UserListFromJSON,
  UserListFromJSONTyped,
  UserListToJSON,
} from "./UserList";

/**
 *
 * @export
 * @interface PaginatedUserListList
 */
export interface PaginatedUserListList {
  /**
   *
   * @type {number}
   * @memberof PaginatedUserListList
   */
  count?: number;
  /**
   *
   * @type {string}
   * @memberof PaginatedUserListList
   */
  next?: string | null;
  /**
   *
   * @type {string}
   * @memberof PaginatedUserListList
   */
  previous?: string | null;
  /**
   *
   * @type {Array<UserList>}
   * @memberof PaginatedUserListList
   */
  results?: Array<UserList>;
}

/**
 * Check if a given object implements the PaginatedUserListList interface.
 */
export function instanceOfPaginatedUserListList(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function PaginatedUserListListFromJSON(
  json: any
): PaginatedUserListList {
  return PaginatedUserListListFromJSONTyped(json, false);
}

export function PaginatedUserListListFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PaginatedUserListList {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    count: !exists(json, "count") ? undefined : json["count"],
    next: !exists(json, "next") ? undefined : json["next"],
    previous: !exists(json, "previous") ? undefined : json["previous"],
    results: !exists(json, "results")
      ? undefined
      : (json["results"] as Array<any>).map(UserListFromJSON),
  };
}

export function PaginatedUserListListToJSON(
  value?: PaginatedUserListList | null
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
        : (value.results as Array<any>).map(UserListToJSON),
  };
}
