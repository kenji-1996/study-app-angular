/**
 * Created by Kenji on 12/31/2017.
 */
'use strict';

export const url='http://localhost:4949';
//export const url='https://study.techgorilla.io';
export function authoredTests(userId) {
    return '/api/users/' + userId + '/tests/authored';
}
export function selfTests(userId) {
    return '/api/users/' + userId + '/tests/self';
}
export function allocatedTests(userId) {
    return '/api/users/' + userId + '/tests/allocated';
}