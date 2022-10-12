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
  RoleGroup,
  RoleGroupFromJSON,
  RoleGroupFromJSONTyped,
  RoleGroupToJSON,
} from "./RoleGroup";
import {
  RoleUser,
  RoleUserFromJSON,
  RoleUserFromJSONTyped,
  RoleUserToJSON,
} from "./RoleUser";

/**
 *
 * @export
 * @interface Role
 */
export interface Role {
  /**
   *
   * @type {number}
   * @memberof Role
   */
  readonly id: number;
  /**
   *
   * @type {boolean}
   * @memberof Role
   */
  isActive?: boolean;
  /**
   *
   * @type {string}
   * @memberof Role
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof Role
   */
  description: string;
  /**
   *
   * @type {Array<RoleUser>}
   * @memberof Role
   */
  users: Array<RoleUser>;
  /**
   *
   * @type {Array<RoleGroup>}
   * @memberof Role
   */
  groups: Array<RoleGroup>;
  /**
   *
   * @type {Array<RoleUser>}
   * @memberof Role
   */
  adminUsers: Array<RoleUser>;
  /**
   *
   * @type {Array<RoleGroup>}
   * @memberof Role
   */
  adminGroups: Array<RoleGroup>;
}

export function RoleFromJSON(json: any): Role {
  return RoleFromJSONTyped(json, false);
}

export function RoleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Role {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    isActive: !exists(json, "is_active") ? undefined : json["is_active"],
    name: json["name"],
    description: json["description"],
    users: (json["users"] as Array<any>).map(RoleUserFromJSON),
    groups: (json["groups"] as Array<any>).map(RoleGroupFromJSON),
    adminUsers: (json["admin_users"] as Array<any>).map(RoleUserFromJSON),
    adminGroups: (json["admin_groups"] as Array<any>).map(RoleGroupFromJSON),
  };
}

export function RoleToJSON(value?: Role | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    is_active: value.isActive,
    name: value.name,
    description: value.description,
    users: (value.users as Array<any>).map(RoleUserToJSON),
    groups: (value.groups as Array<any>).map(RoleGroupToJSON),
    admin_users: (value.adminUsers as Array<any>).map(RoleUserToJSON),
    admin_groups: (value.adminGroups as Array<any>).map(RoleGroupToJSON),
  };
}
